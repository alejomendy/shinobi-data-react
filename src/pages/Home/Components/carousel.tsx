import { useEffect, useState } from "react";

interface CarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  images,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${
              index === currentIndex ? "active" : ""
            }`}
          >
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
        <button
          onClick={goToPrevious}
          className="carousel-button carousel-button--prev"
          aria-label="Previous slide"
        >
          {"<"}
        </button>
        <button
          onClick={goToNext}
          className="carousel-button carousel-button--next"
          aria-label="Next slide"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};
