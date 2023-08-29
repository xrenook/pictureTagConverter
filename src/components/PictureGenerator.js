import React, { useState, useEffect } from "react";
import styles from "./components.module.css";

function PictureGenerator() {
  const [images, setImages] = useState([
    { media: "(min-width: 1024px)", url: "", size: "Desktop" }, // Desktop
    {
      media: "(min-width:769px) and (max-width: 1023px)",
      url: "",
      size: "Tablet",
    }, // Tablet
    { media: "(max-width: 768px)", url: "", size: "Mobile" }, // Mobile
  ]);
  const [altText, setAltText] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [currentMedia, setCurrentMedia] = useState("Desktop");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isCopied, setIsCopied] = useState(false);
  const [loadingType, setLoadingType] = useState("lazy");

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    updateCurrentMedia(); // Call the function

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const handleImageUrlChange = (event, index) => {
    const updatedImages = [...images];
    updatedImages[index].url = event.target.value;
    setImages(updatedImages);
  };

  const handleAltTextChange = (event) => {
    setAltText(event.target.value);
  };

  const handleWidthChange = (event) => {
    setWidth(event.target.value);
  };

  const handleHeightChange = (event) => {
    setHeight(event.target.value);
  };

  const handleLoadingTypeChange = (event) => {
    setLoadingType(event.target.value);
  };

  const generatePictureCode = () => {
    const sources = images
      .filter((image) => image.url) // Filter out images with null srcSet
      .map((image) => `<source srcset="${image.url}" media="${image.media}" />`)
      .join("\n");

    const imgAttributes = [];
    if (altText) {
      imgAttributes.push(`alt="${altText}"`);
    }
    if (width) {
      imgAttributes.push(`width="${width}"`);
    } else {
      imgAttributes.push('width="auto"');
    }
    if (height) {
      imgAttributes.push(`height="${height}"`);
    } else {
      imgAttributes.push('height="auto"');
    }
    imgAttributes.push(`loading="${loadingType}"`);

    const imgTag = `<img src="${images[0].url}" ${imgAttributes.join(" ")} />`;

    return `<picture>\n${sources}\n${imgTag}\n</picture>`;
  };

  const updateCurrentMedia = () => {
    for (const image of images) {
      if (window.matchMedia(image.media).matches) {
        setCurrentMedia(image.size);
        break;
      }
    }
  };

  const copyToClipboard = () => {
    const textarea = document.querySelector("textarea");
    textarea.select();
    document.execCommand("copy");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <div>
      <div className={`${styles.indicator}`}>
        <div>
          <span>{windowWidth} px</span>
        </div>
        <div>
          <span>{currentMedia}</span>
        </div>
      </div>
      <div className={`${styles.container}`}>
        <div className={`${styles.detail}`}>
          <div className={`${styles.general}`}>
            <h4>General Info</h4>
            <div className={`${styles.row}`}>
              <label>Image Alt:</label>
              <input
                type="text"
                value={altText}
                onChange={handleAltTextChange}
                placeholder="seo friendly keywords"
              />
            </div>

            <div className={`${styles.row}`}>
              <label>Width:</label>
              <input
                type="text"
                value={width}
                onChange={handleWidthChange}
                placeholder="default: auto"
              />
            </div>
            <div className={`${styles.row}`}>
              <label>Height:</label>
              <input
                type="text"
                value={height}
                onChange={handleHeightChange}
                placeholder="default: auto"
              />
            </div>

            <div className={`${styles.row}`}>
              <label>Loading Type:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="lazy"
                    checked={loadingType === "lazy"}
                    onChange={handleLoadingTypeChange}
                  />
                  Lazy
                </label>
                <label>
                  <input
                    type="radio"
                    value="eager"
                    checked={loadingType === "eager"}
                    onChange={handleLoadingTypeChange}
                  />
                  Eager
                </label>
              </div>
            </div>
          </div>
          <div className={`${styles.urls}`}>
            {images.map((image, index) => (
              <div key={index}>
                <h4>{image.size}</h4>
                <div className={`${styles.row}`}>
                  <input
                    type="text"
                    value={image.url}
                    onChange={(event) => handleImageUrlChange(event, index)}
                    placeholder="https://"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`${styles.preview}`}>
          <h4>Preview</h4>

          <div className={`${styles.imgContainer}`}>
            {isCopied && (
              <span className={`${styles.notification}`}>
                Copied to clipboard
              </span>
            )}
            {images[0].url && (
              <picture>
                {images.map((image, index) => (
                  <source key={index} srcSet={image.url} media={image.media} />
                ))}
                <img
                  src={images[0].url}
                  alt={images[0].alt}
                  width={width}
                  height={height}
                />
              </picture>
            )}
            {images[0].url && (
              <div className={`${styles.code}`} onClick={copyToClipboard}>
                <textarea
                  className={`${styles.codeContent}`}
                  rows={5}
                  value={generatePictureCode()}
                  readOnly
                />
                <div className={`${styles.copy}`}>Click to Copy</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PictureGenerator;
