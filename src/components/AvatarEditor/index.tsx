import {Button} from "@/components/ui/Button";
import {Slider} from "@/components/ui/Slider";
import {RotateCw, ZoomIn, ZoomOut} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

interface ImageEditorProps {
    imageSrc: string;
    onSave: (canvas: HTMLCanvasElement) => void;
    onChangeImage?: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
                                                     imageSrc,
                                                     onSave,
                                                 }) => {
    const {t} = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({x: 0, y: 0});
    const [imageLoaded, setImageLoaded] = useState(false);

    const MIN_SCALE = 0.5;
    const MAX_SCALE = 3;

    useEffect(() => {
            const img = new Image();
            img.onload = () => {
                if (imageRef.current) {
                    imageRef.current.width = img.width;
                    imageRef.current.height = img.height;

                    if (canvasRef.current && containerRef.current) {
                        const canvas = canvasRef.current;
                        const container = containerRef.current;

                        canvas.width = container.clientWidth;
                        canvas.height = container.clientHeight;

                        const circleSize = Math.min(canvas.width,
                            canvas.height);
                        const imgAspect = img.width / img.height;

                        let initialScale;
                        if (imgAspect >= 1) {
                            initialScale = Math.max(
                                circleSize / img.height,
                                circleSize / img.width
                            );
                        } else {
                            initialScale = Math.max(
                                circleSize / img.width,
                                circleSize / img.height
                            );
                        }

                        initialScale = Math.max(initialScale,
                            MIN_SCALE);

                        setScale(initialScale);

                        centerImage(img,
                            initialScale);
                        setImageLoaded(true);
                    }
                }
            };
            img.src = imageSrc;
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [imageSrc]);

    useEffect(() => {
            if (imageLoaded) {
                drawImage();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [scale, position, imageLoaded]);

    const centerImage = (img: HTMLImageElement, scaleValue = scale) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        setPosition({
            x: centerX - (img.width * scaleValue) / 2,
            y: centerY - (img.height * scaleValue) / 2,
        });
    };

    const drawImage = () => {
        if (!canvasRef.current || !imageRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = imageRef.current;

        if (ctx) {
            ctx.clearRect(0,
                0,
                canvas.width,
                canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(canvas.width,
                canvas.height) / 2;

            // Draw the image first
            ctx.drawImage(
                img,
                position.x,
                position.y,
                img.width * scale,
                img.height * scale
            );

            ctx.globalCompositeOperation = "destination-in";
            ctx.beginPath();
            ctx.arc(centerX,
                centerY,
                radius,
                0,
                Math.PI * 2,
                false);
            ctx.fill();

            ctx.globalCompositeOperation = "source-over";

            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX,
                centerY,
                radius,
                0,
                Math.PI * 2,
                false);
            ctx.stroke();

            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(centerX - radius,
                centerY);
            ctx.lineTo(centerX + radius,
                centerY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(centerX,
                centerY - radius);
            ctx.lineTo(centerX,
                centerY + radius);
            ctx.stroke();
        }
    };

    const enforceImageBounds = (newPosition: { x: number; y: number }) => {
        if (!canvasRef.current || !imageRef.current) return newPosition;

        const canvas = canvasRef.current;
        const img = imageRef.current;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width,
            canvas.height) / 2;

        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        const minX = Math.min(centerX + radius - scaledWidth,
            centerX - radius);
        const maxX = Math.max(centerX - radius,
            centerX + radius - scaledWidth);

        const minY = Math.min(centerY + radius - scaledHeight,
            centerY - radius);
        const maxY = Math.max(centerY - radius,
            centerY + radius - scaledHeight);

        return {
            x: Math.min(Math.max(newPosition.x,
                    minX),
                maxX),
            y: Math.min(Math.max(newPosition.y,
                    minY),
                maxY),
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (canvasRef.current) {
            setIsDragging(true);
            const rect = canvasRef.current.getBoundingClientRect();
            setDragStart({
                x: e.clientX - rect.left - position.x,
                y: e.clientY - rect.top - position.y,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const newPosition = {
                x: e.clientX - rect.left - dragStart.x,
                y: e.clientY - rect.top - dragStart.y,
            };

            setPosition(enforceImageBounds(newPosition));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleZoomIn = () => {
        setScale((prev) => {
            const newScale = Math.min(prev + 0.1,
                MAX_SCALE);

            if (canvasRef.current && imageRef.current) {
                const canvas = canvasRef.current;
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                const imgCenterX = position.x + (imageRef.current.width * prev) / 2;
                const imgCenterY = position.y + (imageRef.current.height * prev) / 2;

                const scaleChange = newScale / prev;

                const dx = centerX - imgCenterX;
                const dy = centerY - imgCenterY;

                const newPosition = {
                    x:
                        centerX -
                        dx * scaleChange -
                        (imageRef.current.width * newScale) / 2,
                    y:
                        centerY -
                        dy * scaleChange -
                        (imageRef.current.height * newScale) / 2,
                };

                setPosition(enforceImageBounds(newPosition));
            }

            return newScale;
        });
    };

    const handleZoomOut = () => {
        setScale((prev) => {
            const newScale = Math.max(prev - 0.1,
                MIN_SCALE);

            if (canvasRef.current && imageRef.current) {
                const canvas = canvasRef.current;
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                const imgCenterX = position.x + (imageRef.current.width * prev) / 2;
                const imgCenterY = position.y + (imageRef.current.height * prev) / 2;

                const scaleChange = newScale / prev;

                const dx = centerX - imgCenterX;
                const dy = centerY - imgCenterY;

                const newPosition = {
                    x:
                        centerX -
                        dx * scaleChange -
                        (imageRef.current.width * newScale) / 2,
                    y:
                        centerY -
                        dy * scaleChange -
                        (imageRef.current.height * newScale) / 2,
                };

                setPosition(enforceImageBounds(newPosition));
            }

            return newScale;
        });
    };

    const handleSliderChange = (value: number[]) => {
        const prevScale = scale;
        const newScale = MIN_SCALE + (value[0] / 100) * (MAX_SCALE - MIN_SCALE);

        if (canvasRef.current && imageRef.current) {
            const canvas = canvasRef.current;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const imgCenterX = position.x + (imageRef.current.width * prevScale) / 2;
            const imgCenterY = position.y + (imageRef.current.height * prevScale) / 2;

            const scaleChange = newScale / prevScale;

            const dx = centerX - imgCenterX;
            const dy = centerY - imgCenterY;

            const newPosition = {
                x: centerX - dx * scaleChange - (imageRef.current.width * newScale) / 2,
                y:
                    centerY - dy * scaleChange - (imageRef.current.height * newScale) / 2,
            };

            setPosition(enforceImageBounds(newPosition));
        }

        setScale(newScale);
    };

    const handleReset = () => {
        if (imageRef.current) {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const circleSize = Math.min(canvas.width,
                    canvas.height);
                const imgAspect = imageRef.current.width / imageRef.current.height;

                let initialScale;
                if (imgAspect >= 1) {
                    initialScale = Math.max(
                        circleSize / imageRef.current.height,
                        circleSize / imageRef.current.width
                    );
                } else {
                    initialScale = Math.max(
                        circleSize / imageRef.current.width,
                        circleSize / imageRef.current.height
                    );
                }

                initialScale = Math.max(initialScale,
                    MIN_SCALE);

                setScale(initialScale);
                centerImage(imageRef.current,
                    initialScale);
            }
        }
    };

    const handleSave = () => {
        if (canvasRef.current && imageRef.current) {
            const finalCanvas = document.createElement("canvas");
            const ctx = finalCanvas.getContext("2d",
                {alpha: true});

            if (ctx) {
                const sourceCanvas = canvasRef.current;
                const centerX = sourceCanvas.width / 2;
                const centerY = sourceCanvas.height / 2;
                const radius = Math.min(sourceCanvas.width,
                    sourceCanvas.height) / 2;

                finalCanvas.width = radius * 2;
                finalCanvas.height = radius * 2;

                ctx.clearRect(0,
                    0,
                    finalCanvas.width,
                    finalCanvas.height);

                ctx.drawImage(
                    imageRef.current,
                    position.x - (centerX - radius),
                    position.y - (centerY - radius),
                    imageRef.current.width * scale,
                    imageRef.current.height * scale
                );

                ctx.globalCompositeOperation = "destination-in";
                ctx.beginPath();
                ctx.arc(radius,
                    radius,
                    radius,
                    0,
                    Math.PI * 2);
                ctx.fill();

                onSave(finalCanvas);
            }
        }
    };

    const handleTouch = (e: React.TouchEvent) => {
        if (canvasRef.current && e.touches.length === 1) {
            setIsDragging(true);
            const rect = canvasRef.current.getBoundingClientRect();
            const touch = e.touches[0];
            setDragStart({
                x: touch.clientX - rect.left - position.x,
                y: touch.clientY - rect.top - position.y,
            });
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging && canvasRef.current && e.touches.length === 1) {
            const rect = canvasRef.current.getBoundingClientRect();
            const touch = e.touches[0];
            const newPosition = {
                x: touch.clientX - rect.left - dragStart.x,
                y: touch.clientY - rect.top - dragStart.y,
            };

            setPosition(enforceImageBounds(newPosition));
            e.preventDefault();
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <div
                ref={containerRef}
                className="relative h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouch}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => setIsDragging(false)}
            >
                <canvas ref={canvasRef} className="absolute inset-0 cursor-move"/>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={imageRef}
                    src={imageSrc}
                    className="hidden"
                    alt="Editor source"
                />
            </div>

            <div className="flex items-center space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleZoomOut}
                    disabled={scale <= MIN_SCALE}
                >
                    <ZoomOut className="h-4 w-4"/>
                </Button>

                <div className="flex-1">
                    <Slider
                        value={[((scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 100]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleSliderChange}
                    />
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleZoomIn}
                    disabled={scale >= MAX_SCALE}
                >
                    <ZoomIn className="h-4 w-4"/>
                </Button>
            </div>

            <div className="flex justify-between pt-2">
                <div className="flex space-x-2">
                    <Button type="button" variant="default" onClick={handleReset}>
                        <RotateCw className="h-4 w-4 mr-2"/>
                        {t("global.buttonReset")}
                    </Button>
                </div>
                <Button
                    type="button"
                    className="bg-primary hover:bg-[#063a68]"
                    onClick={handleSave}
                >
                    {t("global.buttonSave")}
                </Button>
            </div>
        </div>
    );
};

export default ImageEditor;
