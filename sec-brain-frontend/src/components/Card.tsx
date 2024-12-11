import { DeleteIcon } from "../icons/Delete"
import { DocumentIcon } from "../icons/Document"

type CardProps={
    title: string;
    link: string;
    heading?: string;
    tags?: string;
    description?: string;
    type: "twitter"|"youtube"|"document";
}

const getYTembedUrl=(url: string)=>{
    const ytRegex=/(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/g
    const match=url.match(ytRegex);
    if (match && match[1]){
        return `https://youtube.com/embed/${match[1]}`
    }
    return null;
}

export const Card=(props: CardProps)=>{
    let embedUrl:string|null=null;
    if (props.type==="youtube"){
        embedUrl=getYTembedUrl(props.link)
    }
    return <div className="rounded-xl bg-white box-shadow-md border-[#E2E7E5] w-[300px] border m-5 px-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center text-md gap-3 py-4">
                <DocumentIcon/>
                {props.title}
                {/* <DeleteIcon/> */}
            </div>
            <DeleteIcon/>
        </div>
        {props.type==="youtube" && embedUrl ? (<iframe className="w-full rounded-lg" src={embedUrl} title="YouTube video player" 
            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
            </iframe>): (
                props.type==="youtube" && <div className="w-full rounded-lg h-48 items-center justify-center text-gray-600"></div>
            )}
        {props.type=="twitter" && <div className="w-full overflow-hidden">
                <blockquote className="twitter-tweet">
                    <a href={props.link.replace("x.com", "twitter.com")} target="_blank"></a> 
                </blockquote>
            </div>}
    </div>
}