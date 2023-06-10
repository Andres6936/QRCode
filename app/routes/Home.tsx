import {Ref, useEffect, useMemo, useRef, useState} from "react";
import {QRCode} from "../../src/QRCode";

export function Home() {
    const canvasRef: Ref<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
    const encoding = useMemo(() => {
        return new QRCode({
            width: 400,
            height: 400,
        });
    }, [])

    const [value, setValue] = useState<string>('https://jindo.dev.naver.com/collie')

    useEffect(() => {
        if (canvasRef.current && !canvasRef.current.hasChildNodes()) {
            encoding.drawAt(value, canvasRef.current);
        }
    }, [])

    const onCreateCode = () => encoding.drawAt(value, canvasRef.current);

    return (
        <div className={"position:relative flex flex:col pb:6em"}>
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

            <div className={"flex flex:col mt:1em px:2em gap:1.5em"}>
                <div className={"flex flex:col"}>
                    <p className={"font:sans"}>Estilo</p>
                    <div className={"flex flex:row gap:1em"}>
                        <div className={"w:3em h:3em r:0.6em bg:gray-86"}/>
                        <div className={"w:3em h:3em r:0.6em bg:gray-86"}/>
                    </div>
                </div>

                <div className={"flex flex:col"}>
                    <p className={"font:sans"}>Color</p>
                    <div className={"flex flex:row gap:1em"}>
                        <div className={"w:3em h:3em r:50% bg:black"}/>
                        <div className={"w:3em h:3em r:50% bg:blue-50"}/>
                        <div className={"w:3em h:3em r:50% bg:red-50"}/>
                        <div className={"w:3em h:3em r:50% bg:orange-50"}/>
                        <div className={"w:3em h:3em r:50% bg:green-50"}/>
                    </div>
                </div>

                <div className={"flex flex:col"}>
                    <p className={"font:sans"}>Tipo de archivo</p>
                    <select className={"r:0.7rem px:0.5em py:0.5em b:1px|solid|#CCC font-size:1.2em"}>
                        <option>JPE</option>
                        <option>PNG</option>
                        <option>SVG</option>
                    </select>
                </div>
            </div>

            <div className={"position:fixed bottom:1em left:0 right:0 flex flex:row justify-content:center px:2em"}>
                <button
                    className={"r:1.5rem py:0.5em bg:fuchsia-52 b:none color:white font:bold font-size:1.2em w:21rem"}>
                    Descargar
                </button>
            </div>
        </div>
    )
}