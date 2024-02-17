import random
import cv2
import numpy as np
from ultralytics import YOLO
import argparse
import supervision as sv

detection_colors = [(0,0,255),(0,255,0),(255,0,0),(255,0,255),(0,255,255)]
class_list = ['Can', 'HDPE', 'PET_BOTTLE', 'Plastic_wrapper', 'Tetrapak']
# load a pretrained YOLOv8n model
model = YOLO("best2.pt")

ZONE_POLYGON = np.array([
    [0, 0],
    [0.5, 0],
    [0.5, 1.25],
    [0, 1.25]
])

def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="YOLOv8 live")
    parser.add_argument(
        "--webcam-resolution", 
        default=[1280, 720], 
        nargs=2, 
        type=int
    )
    args = parser.parse_args()
    return args

# cap = cv2.VideoCapture(1)
args = parse_arguments()
frame_width, frame_height = args.webcam_resolution

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, frame_width)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_height)
out=cv2.VideoWriter('output.avi', cv2.VideoWriter_fourcc('M', 'J', 'P', 'G'), 20, (frame_width, frame_height))

zone_polygon = (ZONE_POLYGON * np.array(args.webcam_resolution)).astype(int)
zone = sv.PolygonZone(polygon=zone_polygon, frame_resolution_wh=tuple(args.webcam_resolution))
zone_annotator = sv.PolygonZoneAnnotator(
    zone=zone, 
    color=sv.Color.RED,
    thickness=2,
    text_thickness=4,
    text_scale=2,
)

if not cap.isOpened():
    print("Cannot open camera")
    exit()
n=0
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    # if frame is read correctly ret is True

    if not ret:
        print("Can't receive frame (stream end?). Exiting ...")
        break

    #  resize the frame | small frame optimise the run
    # frame = cv2.resize(frame, (frame_wid, frame_hyt))

    # Predict on image
    results = model.predict(source=[frame], conf=0.5, save=False)

    # Convert tensor array to numpy
    DP = results[0].numpy()
    # print(DP)
    detections = sv.Detections.from_ultralytics(results[0])
    if len(DP) != 0:
        for i in range(len(results[0])):
            print(i)

            boxes = results[0].boxes
            box = boxes[i]  # returns one box
            clsID = box.cls.numpy()[0]
            conf = box.conf.numpy()[0]
            bb = box.xyxy.numpy()[0]

            cv2.rectangle(
                frame,
                (int(bb[0]), int(bb[1])),
                (int(bb[2]), int(bb[3])),
                detection_colors[int(clsID)],
                3,
            )

            # Display class name and confidence
            font = cv2.FONT_HERSHEY_COMPLEX
            cv2.putText(
                frame,
                class_list[int(clsID)] + " " + str(round(conf, 3)) + "%",
                (int(bb[0]), int(bb[1]) - 10),
                font,
                1,
                (255, 255, 255),
                2,
            )

    zone.trigger(detections=detections)
    n = n + zone.current_count
    zone.current_count=n
    print(zone.current_count)
    frame = zone_annotator.annotate(scene=frame)  
    out.write(frame)
    # Display the resulting frame
    # cv2.imshow("OBJDet", frame)
    cv2.imshow('Image',frame)
    # Terminate run when "Q" pressed
    if (cv2.waitKey(30) == 27):
        break
print("Final count = ",n)
# When everything done, release the capture
out.release()
cap.release()
cv2.destroyAllWindows()