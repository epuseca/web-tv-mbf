import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Tooltip } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import imageApi from '../api/imageApi';

const SLIDE_INTERVAL = 10000; // 10 seconds

const DisplayPage = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const progressRef = useRef(null);
    const slideRef = useRef(null);

    // Track fullscreen state changes (e.g. user presses Esc)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    // Fetch images
    const fetchImages = useCallback(async () => {
        try {
            const res = await imageApi.getAll({ active: true });
            const newImages = res.data.data || [];
            setImages((prevImages) => {
                if (newImages.length > 0 && newImages.length <= currentIndex) {
                    setCurrentIndex(0);
                }
                return newImages;
            });
        } catch (error) {
            console.error('Failed to fetch images:', error);
        } finally {
            setLoading(false);
        }
    }, [currentIndex]);

    useEffect(() => {
        fetchImages();

        const apiBase = import.meta.env.VITE_API_URL || '/api';
        const eventSource = new EventSource(`${apiBase}/images/events`);

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (['image_created', 'image_updated', 'image_deleted'].includes(data.type)) {
                    console.log(`🔄 Real-time update: ${data.type}`);
                    fetchImages();
                }
            } catch (err) {
                // ignore parse errors
            }
        };

        eventSource.onerror = () => {
            console.warn('⚠️ SSE connection lost, reconnecting...');
        };

        return () => eventSource.close();
    }, [fetchImages]);

    // Slideshow timer
    useEffect(() => {
        if (images.length <= 1) return;

        setProgress(0);
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + (100 / (SLIDE_INTERVAL / 100));
            });
        }, 100);

        slideRef.current = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, SLIDE_INTERVAL);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(slideRef.current);
        };
    }, [currentIndex, images.length]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
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

            {/* Fullscreen Button */}
            <Tooltip title={isFullscreen ? 'Thoát toàn màn hình (F)' : 'Toàn màn hình (F)'} placement="bottomLeft">
                <Button
                    type="text"
                    icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    onClick={toggleFullscreen}
                    style={{
                        position: 'fixed',
                        top: 16,
                        right: 16,
                        zIndex: 1000,
                        color: '#fff',
                        background: 'rgba(0, 0, 0, 0.45)',
                        border: 'none',
                        borderRadius: 8,
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        backdropFilter: 'blur(4px)',
                    }}
                />
            </Tooltip>

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