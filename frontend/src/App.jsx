import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage'
import VideoUpload from './components/VideoUpload';
import Layout from './components/Layout';
import WebcamPage from './components/WebcamPage';
import About from './components/About';
import YoloModel from './components/YoloModel';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="video-upload" element={<VideoUpload />} />
        <Route path="webcam" element={<WebcamPage />} />
        <Route path="about-us" element={<About />} />
        <Route path="yolo-model" element={<YoloModel />} />
      </Route>
    </Routes>
  )
}

export default App
