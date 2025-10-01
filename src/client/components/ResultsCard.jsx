import "./Theme.css";

function ResultsCard({name, git_username, image, age, zodiac, avatar}) {
    return (
        <div className=
            "bg-card-main-color relative rounded-md min-h-[325px] min-w-[275px] max-h-[350px] max-w-[275px] m-2 p-2 text-text-main-color"
        >
           {avatar && (
               <div className="flex items-center mb-2">
                   <img 
                       src={avatar} 
                       alt="User avatar"
                       className="w-8 h-8 rounded-full mr-2 absolute top-2 left-2"
                   />
               </div>
           )}
           <p className="text-sm">Name: {name}</p> 
           {git_username && <p className="text-sm">(@{git_username})</p>}
           <p className="text-sm">Age: {age}</p>
           <p className="text-sm">Zodiac: {zodiac}</p>
           <img src={image} className="inline w-50 h-50 border-dotted border-2 rounded-md"></img>
        </div>
    );
}

export default ResultsCard;