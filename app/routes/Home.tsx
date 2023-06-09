import {useEffect, useRef, useState} from "react";
import {QRCode} from "../../src/QRCode";

export function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [value, setValue] = useState<string>('https://jindo.dev.naver.com/collie')

    useEffect(() => {
        if (canvasRef.current && !canvasRef.current.hasChildNodes()) {
            const qrcode = new QRCode(canvasRef.current, {
                width: 400,
                height: 400,
            });

            function makeCode() {
                if (value === '') {
                    alert("Input a text");
                    return;
                }

                qrcode.makeCode(value);
            }

            makeCode();
        }
    }, [])

    const onCreateCode = () => {
    }

    return (
        <div className={"position:relative flex flex:col"}>
            <div className={"flex flex:col bg:gray-90 pb:3em bb:1px|solid|#CCC rb:3em"}>
                <div ref={canvasRef} className={"flex justify-content:center align-items:center w:100% py:1em"}/>

                <div className={"flex flex:col justify-content:center px:2em"}>
                    <p className="text-align:center font:sans font-size:1em mt:3em mb:2em opacity:0.8">
                        Ingresa o pega la URL del sitio web
                    </p>

                    <input className="r:1rem b:1px|solid|#CCC px:1em py:0.3em font-size:1.2em mb:2em" type="text"
                           onChange={({target}) => setValue(target.value)} value={value}/>

                    <button className={"r:1.5rem py:0.5em bg:black b:none color:white font:bold font-size:1.2em"}
                            onClick={onCreateCode}>
                        Crear código QR
                    </button>
                </div>
            </div>

            <div className={"position:fixed bottom:1em left:0 right:0 flex flex:col px:2em"}>
                <button className={"r:1.5rem py:0.5em bg:fuchsia-52 b:none color:white font:bold font-size:1.2em"}>
                    Descargar
                </button>
            </div>
        </div>
    )
}