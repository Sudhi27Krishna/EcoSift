module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'eco-green': '#026670',
                'eco-gray': '#EDEAE5',
            },
            letterSpacing: {
                needed: '.09em',
            },

            fontFamily: { //custom font style
                'Outfit-Thin': "Outfit-Thin",
                'Outfit-ExtraLight': "Outfit-ExtraLight",
                'Outfit-Light': "Outfit-Light",
                'Outfit-Regular': "Outfit-Regular",
                'Outfit-Medium': "Outfit-Medium",
                'Outfit-SemiBold': "Outfit-SemiBold",
                'Outfit-Bold': "Outfit-Bold",
                'Outfit-ExtraBold': "Outfit-ExtraBold",
                'Outfit-Black': "Outfit-Black",
            },

        },
    },
    plugins: [],
}