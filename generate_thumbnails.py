import cv2
import os

def generate_thumbnails():
    try:
        # Update these paths to match your project structure
        base_dir = os.path.dirname(os.path.abspath(__file__))
        video_dir = os.path.join(base_dir, 'static', 'videos')
        thumbnail_dir = os.path.join(base_dir, 'static', 'images', 'thumbnails')
        
        print(f"Looking for videos in: {video_dir}")
        
        # Create thumbnails directory if it doesn't exist
        if not os.path.exists(thumbnail_dir):
            os.makedirs(thumbnail_dir)
            print(f"Created thumbnails directory at: {thumbnail_dir}")
        
        # List all videos in the directory
        videos = [f for f in os.listdir(video_dir) if f.endswith('.mp4')]
        print(f"Found {len(videos)} videos")
        
        # Process each video
        for video_file in videos:
            video_path = os.path.join(video_dir, video_file)
            thumbnail_name = video_file.replace('.mp4', '-thumb.jpg')
            thumbnail_path = os.path.join(thumbnail_dir, thumbnail_name)
            
            print(f"Processing {video_file}...")
            
            # Open video file
            cap = cv2.VideoCapture(video_path)
            
            # Check if video opened successfully
            if not cap.isOpened():
                print(f"Error: Could not open video {video_file}")
                continue
                
            # Read the first frame
            success, frame = cap.read()
            
            if success:
                # Save the frame as thumbnail
                cv2.imwrite(thumbnail_path, frame)
                print(f"Created thumbnail: {thumbnail_name}")
            else:
                print(f"Failed to capture frame from {video_file}")
            
            # Release the video capture object
            cap.release()
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == '__main__':
    print("Starting thumbnail generation...")
    generate_thumbnails()
    print("Thumbnail generation complete!")