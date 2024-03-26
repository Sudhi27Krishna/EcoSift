from ultralytics import YOLO
import supervision as sv
import numpy as np

class_list = ["Can", "HDPE", "PET_Bottle", "Plastic_wrapper", "Tetrapak"]
#change coordinates as required
# polygon = np.array()
# START = sv.Point(0,0)
# END = sv.Point(0,0)

model = YOLO('detect-model\\best.pt')

line_Zone = []
polygon_Zone = []

def setPolygon(path):
    video_info = sv.VideoInfo.from_video_path(path) #specify the path
    polygon = np.array([
    [0, 0],
    [0, video_info.height],
    [video_info.width, video_info.height],
    [video_info.width, 0]
    ])
    START = sv.Point(video_info.width//2,0)
    END = sv.Point(video_info.width//2,video_info.height)
    for i in range(5):
        global polygon_Zone
        global line_Zone
        polygon_Zone.append(sv.PolygonZone(polygon,frame_resolution_wh=video_info.resolution_wh))
        line_Zone.append(sv.LineZone(start=START, end=END))

def classCount(polygon_zone,line_zone,det,id):
    polygon_zone.trigger(detections = det)
    line_zone.trigger(detections = det)
    print(f"Count of {class_list[id]}: Current:{polygon_zone.current_count} Total:{line_zone.out_count}")
    return polygon_zone.current_count,line_zone.out_count

def coord(detections):
    for xyxy, _, class_id, tracker_id in detections:
        print(f"{class_list[class_id]} {tracker_id} {xyxy}")

def video_tracking(cls_select, path):
    setPolygon(path)
    polygon_zone_annotator=sv.PolygonZoneAnnotator(
        zone=polygon_Zone[1], 
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
            cur[index],cls[index] = classCount(polygon_Zone[index],line_Zone[index],det[index],index)

        coord(detections)

        frame = box_annotator.annotate(scene=frame, detections=detections, labels=labels)
        #To make line and Zone visible (Only be able to see the count of HDPE Class)
        frame=polygon_zone_annotator.annotate(frame)
        line_zone_annotator.annotate(frame,line_Zone[1])
        for i in cls_select:
            final_count[i]={'Current':str(cur[class_list.index(i)]),'Total':str(cls[class_list.index(i)])}
        # print("Final count of each class = ",final_count)
        yield frame, final_count
