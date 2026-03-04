import { useState, useEffect, useCallback, useRef } from 'react';
import imageApi from '../api/imageApi';

const SLIDE_INTERVAL = 10000; // 10 seconds

const DisplayPage = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const progressRef = useRef(null);
    const slideRef = useRef(null);

    // Fetch images
    const fetchImages = useCallback(async () => {
        try {
            const res = await imageApi.getAll();
            setImages(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch images:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
        // Refresh images every 60 seconds to catch updates
        const refreshInterval = setInterval(fetchImages, 60000);
        return () => clearInterval(refreshInterval);
    }, [fetchImages]);

    // Slideshow timer
    useEffect(() => {
        if (images.length <= 1) return;

        // Progress bar animation
        setProgress(0);
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + (100 / (SLIDE_INTERVAL / 100));
            });
        }, 100);

        // Slide change
        slideRef.current = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, SLIDE_INTERVAL);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(slideRef.current);
        };
    }, [currentIndex, images.length]);

    // Enter fullscreen on load
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'f' || e.key === 'F') {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen?.();
                } else {
                    document.exitFullscreen?.();
                }
            }
            // Arrow keys to manual navigate
            if (e.key === 'ArrowRight') {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }
            if (e.key === 'ArrowLeft') {
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [images.length]);

    if (loading) {
        return (
            <div className="display-container">
                <div className="display-empty">
                    <div className="empty-icon">📺</div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="display-container">
                <div className="display-empty">
                    <div className="empty-icon">📺</div>
                    <p>Chưa có hình ảnh nào để hiển thị</p>
                    <p style={{ fontSize: 14, opacity: 0.5 }}>
                        Vui lòng thêm hình ảnh từ trang quản trị
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="display-container">
            {images.map((image, index) => (
                <div
                    key={image._id}
                    className={`display-slide ${index === currentIndex ? 'active' : ''}`}
                >
                    <img src={image.imageBase64} alt={image.title} />
                    <div className="display-overlay">
                        {/* <h2>{image.title}</h2> */}
                        {/* {image.description && <p>{image.description}</p>} */}
                    </div>
                </div>
            ))}

            {/* Slide counter */}
            {/* <div className="display-counter">
                {currentIndex + 1} / {images.length}
            </div> */}

            {/* Progress bar */}
            {/* <div
                className="display-progress"
                style={{ width: `${progress}%` }}
            /> */}
        </div>
    );
};

export default DisplayPage;
