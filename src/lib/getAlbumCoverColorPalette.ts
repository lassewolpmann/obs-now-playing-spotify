export const getAlbumCoverColorPalette = (albumCover: HTMLImageElement,
                                          albumCanvas: HTMLCanvasElement,
                                          background: HTMLElement,
                                          playbackDiv: HTMLElement,
                                          playbackProgressBar: HTMLElement) => {
    albumCanvas.width = albumCover.width;
    albumCanvas.height = albumCover.height;
    const ctx = albumCanvas.getContext('2d', {willReadFrequently: true});

    if (ctx) {
        ctx.drawImage(albumCover, 0, 0);
        const imageData: ImageData = ctx.getImageData(0, 0, albumCanvas.width, albumCanvas.height);
        const rgbArray = buildRgb(imageData.data);
        const quantColors = quantization(rgbArray, 0);
        const sortedByLuminance = orderByLuminance(quantColors);

        const [backgroundGradient, textColor] = createLinearGradientBackground(sortedByLuminance)

        background.style.background = backgroundGradient;
        playbackDiv.style.color = textColor;
        playbackProgressBar.style.background = textColor;
    }
}

const buildRgb = (imageData: Uint8ClampedArray) => {
    const rgbValues = [];
    for (let i = 0; i < imageData.length; i += 4) {
        const rgb = {
            r: imageData[i],
            g: imageData[i + 1],
            b: imageData[i + 2],
        };
        rgbValues.push(rgb);
    }
    return rgbValues;
};

const findBiggestColorRange = (rgbValues: any) => {
    let rMin = Number.MAX_VALUE;
    let gMin = Number.MAX_VALUE;
    let bMin = Number.MAX_VALUE;

    let rMax = Number.MIN_VALUE;
    let gMax = Number.MIN_VALUE;
    let bMax = Number.MIN_VALUE;

    rgbValues.forEach((pixel: any) => {
        rMin = Math.min(rMin, pixel.r);
        gMin = Math.min(gMin, pixel.g);
        bMin = Math.min(bMin, pixel.b);

        rMax = Math.max(rMax, pixel.r);
        gMax = Math.max(gMax, pixel.g);
        bMax = Math.max(bMax, pixel.b);
    });

    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;

    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) {
        return "r";
    } else if (biggestRange === gRange) {
        return "g";
    } else {
        return "b";
    }
};

const quantization: any = (rgbValues: any, depth: any) => {
    const MAX_DEPTH = 4;

    // Base case
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
        const color = rgbValues.reduce(
            (prev: any, curr: any) => {
                prev.r += curr.r;
                prev.g += curr.g;
                prev.b += curr.b;

                return prev;
            },
            {
                r: 0,
                g: 0,
                b: 0,
            }
        );

        color.r = Math.round(color.r / rgbValues.length);
        color.g = Math.round(color.g / rgbValues.length);
        color.b = Math.round(color.b / rgbValues.length);

        return [color];
    }

    /**
     *  Recursively do the following:
     *  1. Find the pixel channel (red,green or blue) with the biggest difference/range
     *  2. Order by this channel
     *  3. Divide in half the rgb colors list
     *  4. Repeat process again, until desired depth or base case
     */
    const componentToSortBy = findBiggestColorRange(rgbValues);
    rgbValues.sort((p1: any, p2: any) => {
        return p1[componentToSortBy] - p2[componentToSortBy];
    });

    const mid = rgbValues.length / 2;
    return [
        ...quantization(rgbValues.slice(0, mid), depth + 1),
        ...quantization(rgbValues.slice(mid + 1), depth + 1),
    ];
};

const orderByLuminance = (rgbValues: any) => {
    const calculateLuminance = (p: any) => {
        return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
    };

    return rgbValues.sort((p1: any, p2: any) => {
        return calculateLuminance(p2) - calculateLuminance(p1);
    });
};

const calculateColorDifference = (color1: any, color2: any) => {
    const rDifference = Math.pow(color2.r - color1.r, 2);
    const gDifference = Math.pow(color2.g - color1.g, 2);
    const bDifference = Math.pow(color2.b - color1.b, 2);

    return rDifference + gDifference + bDifference;
};

const createLinearGradientBackground = (rgbValues: any) => {
    const colorPalette = [];

    for (let i = 0; i < rgbValues.length; i++) {
        if (i > 0) {
            const colorDifference = calculateColorDifference(rgbValues[i], rgbValues[i - 1])
            if (colorDifference < 1000) {
                continue;
            }
        }

        colorPalette.push(rgbValues[i])
    }

    let linearGradient = 'linear-gradient(90deg, ';
    let startingColor = 3;
    let maxColors = 2;
    let endColor = startingColor + maxColors;

    if (colorPalette.length < endColor) {
        startingColor = 0;
        endColor = 2;
    }

    for (let i = startingColor; i < endColor; i++) {
        const rgbCode = 'rgb(' + colorPalette[i].r +  ', ' + colorPalette[i].g +  ', ' + colorPalette[i].b + ')';
        if (i !== endColor - 1) {
            linearGradient += (rgbCode + ', ');
        } else {
            linearGradient += (rgbCode + ')');
        }
    }

    const firstColor = colorPalette[startingColor];

    let textColor

    if ((firstColor.r * 0.299) + (firstColor.g * 0.587) + (firstColor.b * 0.114) > 179) {
        textColor = '#000000'
    } else {
        textColor = '#ffffff'
    }

    return [linearGradient, textColor]
}