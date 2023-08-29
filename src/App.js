import "./App.css";
import PictureGenerator from "./components/PictureGenerator";

function App() {
  return (
    <div className="main">
      <h1>Picture Tag Generator</h1>
      <p>
        {
          "This webapp is used to generate responsive <picture> tag by inputing image urls, Desktop url is compulsory."
        }
      </p>
      <ul>
        <li>Destop: (min-width: 1024px)</li>
        <li>Tablet: (min-width:769px) and (max-width: 1023px)</li>
        <li>Mobile: (max-width: 768px)</li>
      </ul>
      <p>You can click code textarea to copy into your clipboard.</p>
      <PictureGenerator />
    </div>
  );
}

export default App;
