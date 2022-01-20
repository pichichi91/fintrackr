import Document, { Html, Head, Main, NextScript } from 'next/document'
class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Kanit:wght@600;700;800&display=swap" rel="stylesheet" />

                    <meta property="og:image" content='https://fintrackr.io/og.png' key="ogimage" />

                </Head>
                <body>
                        <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument