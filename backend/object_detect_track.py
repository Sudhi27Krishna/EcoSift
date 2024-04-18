from ultralytics import YOLO
import supervision as sv
import numpy as np
import argparse
import cv2
from multiprocessing import Event 

stop_event = Event()

class_list = ["Can", "HDPE", "PET_Bottle", "Plastic_wrapper", "Tetrapak"]

model = YOLO('detect-model\\best-200m.pt')

line_Zone = []
polygon_Zone = []

def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="YOLOv8 live")
    parser.add_argument(
        "--webcam-resolution", 
        default=[640, 480], 
        nargs=2, 
        type=int
    )
    args = parser.parse_args()
    return args

def setPolygonVideoTracking(path):
    video_info = sv.VideoInfo.from_video_path(path) #specify the path
    polygon = np.array([
    [0, 0],
    [0, video_info.height],
    [video_info.width, video_info.height],
    [video_info.width, 0]
    ])
    START = sv.Point(video_info.width//2,0)
    END = sv.Point(video_info.width//2,video_info.height)
    for i in range(6):
        global polygon_Zone
        global line_Zone
        polygon_Zone.append(sv.PolygonZone(polygon,frame_resolution_wh=video_info.resolution_wh))
        line_Zone.append(sv.LineZone(start=START, end=END))

def classCount(polygon_zone,line_zone,cnt,det,id):
    polygon_zone.trigger(detections = det)
    line_zone.trigger(detections = det)
    cnt+=polygon_zone.current_count
    print(f"Count of {class_list[id]}: Current:{polygon_zone.current_count} Total:{line_zone.out_count}")
    return polygon_zone.current_count,line_zone.out_count

def lineCircle(frame):
    r=240
    frame = cv2.circle(frame, (320, 240), radius=5, color=(0,255,255), thickness=-1)
    frame = cv2.circle(frame, (320, 240), radius=r, color=(0,255,100), thickness=1)
    frame = cv2.line(frame, (320,240-r), (320,240+r), color=(0,255,100), thickness=1)
    frame = cv2.line(frame, (320-r,240), (320+r,240), color=(0,255,100), thickness=1)
    return frame

def centerPoint(points):
    x_center = int((points[0]+points[2])//2)
    y_center = int((points[1]+points[3])//2)
    return [x_center, y_center]

def coord(detections,frame):
    coordinates = dict()
    for xyxy, _, class_id, tracker_id in detections:
        print(f"{class_list[class_id]} {tracker_id} {xyxy}")
        key = f"{tracker_id}"
        info = centerPoint(list(xyxy))
        info.append(class_list[class_id])
        coordinates[key] = info
        print(coordinates[key][0],coordinates[key][1])
        frame = cv2.circle(frame, (coordinates[key][0],coordinates[key][1]), radius=10, color=(255, 255, 255), thickness=-1)
    return coordinates, frame

def video_tracking(cls_select, path):
    setPolygonVideoTracking(path)
    polygon_zone_annotator=sv.PolygonZoneAnnotator(
        zone=polygon_Zone[5], 
        color=sv.Color.red(),
        thickness=2,
        text_thickness=1,
        text_scale=0.5
    )   
    line_zone_annotator = sv.LineZoneAnnotator(
        thickness=2,
        text_thickness=1,
        text_scale=0.5
    )

    box_annotator = sv.BoxAnnotator(
        thickness=2,
        text_thickness=1,
        text_scale=0.5
    )

    cls = [0,0,0,0,0]
    cur = [0,0,0,0,0]
    cls_selectIndex=[]
    cls_notSelectIndex = [0,1,2,3,4]
    det=[0,0,0,0,0]
    final_count = dict()
    for i in cls_select:
        cls_selectIndex.append(class_list.index(i))
        cls_notSelectIndex.remove(class_list.index(i))

    for result in model.track(source=path, show=False, stream=True, persist=True, agnostic_nms=True, tracker="bytetrack.yaml", conf=0.5):
        coordinates = dict()
        frame = result.orig_img
        detections = sv.Detections.from_yolov8(result)
        if result.boxes.id is not None:
            detections.tracker_id = result.boxes.id.cpu().numpy().astype(int)
        for index in cls_notSelectIndex:
            detections = detections[detections.class_id != index]
        labels=[
                f"{tracker_id} {result.names[class_id]} {confidence:0.2f}"
                for _, confidence, class_id, tracker_id
                in detections
        ]

        for index in cls_selectIndex:
            det[index] = detections[detections.class_id == index]
            cur[index],cls[index] = classCount(polygon_Zone[index],line_Zone[index],cls[index],det[index],index)

        polygon_Zone[5].trigger(detections = detections)
        # COORDINATE PRINTING OF ALL FRAMES
        coordinates, frame = coord(detections,frame)
        print(coordinates)

        frame = box_annotator.annotate(scene=frame, detections=detections, labels=labels)
        #To make line and Zone visible (Only be able to see the count of HDPE Class)
        frame=polygon_zone_annotator.annotate(frame)

        # if(polygon_Zone[5].current_count == 2):
        #     #contains coordinates of saved frame
        #     coordinates=coord(detections)
        #     cv2.imwrite("frame%d.jpg" % polygon_Zone[5].current_count, frame)
        line_zone_annotator.annotate(frame,line_Zone[1])

        for i in cls_select:
            final_count[i]={'Current':str(cur[class_list.index(i)]),'Total':str(cls[class_list.index(i)])}
        # print("Final count of each class = ",final_count)
        yield frame, final_count, coordinates


def webcam_tracking(cls_select):
    args = parse_arguments()
    frame_width, frame_height = args.webcam_resolution
    print(frame_width, frame_height, args.webcam_resolution)
    polygon = np.array([
    [0, 0],
    [0, frame_height],
    [frame_width, frame_height],
    [frame_width, 0]
    ])
    START = sv.Point(frame_width//2,0)
    END = sv.Point(frame_width//2,frame_height)

    for i in range(6):
        global polygon_Zone
        global line_Zone
        polygon_Zone.append(sv.PolygonZone(polygon,frame_resolution_wh=tuple(args.webcam_resolution)))
        line_Zone.append(sv.LineZone(start=START, end=END))

    polygon_zone_annotator=sv.PolygonZoneAnnotator(
        zone=polygon_Zone[5], 
        color=sv.Color.red(),
        thickness=2,
        text_thickness=1,
        text_scale=0.5
    )   

    line_zone_annotator = sv.LineZoneAnnotator(
        thickness=2,
        text_thickness=1,
        text_scale=0.5
    )

    box_annotator = sv.BoxAnnotator(
        thickness=2,
        text_thickness=1,
        text_scale=0.5
    )

    cls = [0,0,0,0,0]
    cur = [0,0,0,0,0]
    cls_selectIndex=[]
    cls_notSelectIndex = [0,1,2,3,4]
    det=[0,0,0,0,0]
    final_count = dict()
    for i in cls_select:
        cls_selectIndex.append(class_list.index(i))
        cls_notSelectIndex.remove(class_list.index(i))

    for result in model.track(source=0, show=False, stream=True, persist=True, agnostic_nms=True, tracker="bytetrack.yaml", conf=0.5):
        if stop_event.is_set():  # Check if stop event is set
            break
        coordinates = dict()
        frame = lineCircle(result.orig_img)

        detections = sv.Detections.from_yolov8(result)
        if result.boxes.id is not None:
            detections.tracker_id = result.boxes.id.cpu().numpy().astype(int)
        for index in cls_notSelectIndex:
            detections = detections[detections.class_id != index]
        labels=[
                f"{tracker_id} {result.names[class_id]} {confidence:0.2f}"
                for _, confidence, class_id, tracker_id
                in detections
        ]

        for index in cls_selectIndex:
            det[index] = detections[detections.class_id == index]
            cur[index],cls[index] = classCount(polygon_Zone[index],line_Zone[index],cls[index],det[index],index)

        polygon_Zone[5].trigger(detections = detections)
        # COORDINATE PRINTING OF ALL FRAMES
        coordinates, frame = coord(detections, frame)
        print(coordinates)
        
        frame = box_annotator.annotate(scene=frame, detections=detections, labels=labels)
        #To make line and Zone visible (Only be able to see the count of HDPE Class)
            # frame = polygon_zone_annotator.annotate(frame)
            # line_zone_annotator.annotate(frame,line_Zone[1])

        # if(polygon_Zone[5].current_count == 1):
        #     #contains coordinates of saved frame
        #     coordinates=coord(detections)
        #     cv2.imwrite("frame%d.jpg" % polygon_Zone[5].current_count, frame)

        for i in cls_select:
            final_count[i]={'Current':str(cur[class_list.index(i)]),'Total':str(cls[class_list.index(i)])}
        # print("Final count of each class = ",final_count)
        yield frame, final_count, coordinates