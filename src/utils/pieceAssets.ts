// Centralized SVG asset dictionary for all pieces across all variants
export const pieceSvgAssets = import.meta.glob<string>('../assets/pieces/**/*.svg', {
    eager: true,
    import: 'default',
});

// Force the browser to pre-load all piece images into cache
if (typeof window !== 'undefined') {
    Object.values(pieceSvgAssets).forEach((src) => {
        const img = new Image();
        img.src = src;
    });
}
