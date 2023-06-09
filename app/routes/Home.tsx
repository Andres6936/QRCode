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

    return (
        <div className={"flex flex:col"}>
            <label className="text-align:center font:bold font:sans font-size:2em mb:0.5em" htmlFor="text">
                Write any text
            </label>
            <input className="r:1rem b:1px|solid|#CCC px:1em py:0.3em font-size:1.2em mb:1em" type="text"
                   onChange={({target}) => setValue(target.value)} value={value}/>

            <div ref={canvasRef} style={{width: "100px", height: "100px", marginTop: "15px"}}></div>
        </div>
    )
}