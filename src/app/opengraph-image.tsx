import { ImageResponse } from "next/og";

export const alt = "Cuanto Te Quiero — Muebles, blanquería y accesorios para bebés en Rosario";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default share image for pages without their own (products use their photo)
export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #fff5f7 0%, #ffc0cb 100%)",
                    color: "#5a3e36",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ fontSize: 96, fontWeight: 700, color: "#ff6b9d" }}>Cuanto Te Quiero</div>
                <div style={{ fontSize: 40, marginTop: 24 }}>Muebles infantiles, blanquería y accesorios para bebés</div>
                <div style={{ fontSize: 32, marginTop: 40, color: "#8a6a60" }}>Mendoza 6378 · Rosario, Santa Fe</div>
            </div>
        ),
        size
    );
}
