console.log('Running')

let currSong=new Audio();

var songs=[];

let currFolder;

function convertSecondsToMinuteSeconds(seconds) {
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad minutes and seconds with leading zeros if necessary
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${paddedMinutes}:${paddedSeconds}`;
}


async function getSongs(folder){
    currFolder=folder;
    //https://github.com/garv2401/SpotifyClone/tree/main/songs
    let a=await fetch(`https://127.0.0.1:5500/Spotify/${folder}/`);
    //http://127.0.0.1:5500/Spotify/${folder}/
    let response=await a.text();
    //console.log(response);

    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    songs=[];
    //console.log(as);
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            //songs.push(element.href);
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }

    
    
    let songUl=document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUl.innerHTML=" "
    for(const song of songs){
        //let Song=song.split("%")[0];
        let s=decodeURI(song.replaceAll("%20"," "));
        songUl.innerHTML=songUl.innerHTML+`<li>

        <img src="img/music.svg" alt="" class="invert">
                            <div class="info">
                                <div class="songName">
                                ${s}

                                </div>
                                

                            </div>

                            <div class="playNow">
                                <span>Play Now</span>
                                <img src="img/play.svg" alt="" class="invert">
                            </div>
        
        
        
        
         </li>`;

         
    }

    //attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName('li')).forEach(e=>{
        e.addEventListener('click',element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

        })       
    }) 

    playMusic(songs[0],true);

    currSong.addEventListener('timeupdate',()=>{
        
        
        document.querySelector('.songTime').innerHTML=`${convertSecondsToMinuteSeconds(currSong.currentTime)}/${convertSecondsToMinuteSeconds(currSong.duration)}`;

        document.querySelector(".circle").style.left=(currSong.currentTime/currSong.duration)*100 +"%";
    })

    

   

    

}


const playMusic=(track,pause=false)=>{
    //let audio=new Audio("/Spotify/songs/"+track);

    currSong.src=`/Spotify/${currFolder}/`+track;
    //console.log(`/Spotify/${currFolder}/`+track);
    if(!pause){
        currSong.play();
        play.src="img/pause.svg";
        

    }
    else{
        play.src="img/play.svg";
    }
    let s=decodeURI(track);
    document.querySelector(".songInfo").innerHTML=s.split('.')[0];
    document.querySelector('.songTime').innerHTML="00:00/00:00";
    //console.log(document.querySelector('.songTime').innerHTML)

    // //listen for time update
    // currSong.addEventListener('timeupdate',()=>{
        
        
    //     document.querySelector('.songTime').innerHTML=`${convertSecondsToMinuteSeconds(currSong.currentTime)}/${convertSecondsToMinuteSeconds(currSong.duration)}`;

    //     document.querySelector(".circle").style.left=(currSong.currentTime/currSong.duration)*100 +"%";
    // })
   
    
}

async function displayAlbums(){
    let a=await fetch(`https://127.0.0.1:5500/Spotify/songs/`);
    let response=await a.text();
    //console.log(response);

    let div=document.createElement("div");
    div.innerHTML=response;
    let anchors=div.getElementsByTagName('a');
    let cardContainer=document.querySelector('.cardContainer');
    let array=Array.from(anchors);

    for (let index = 0; index < array.length; index++){
        const e = array[index];
        if(e.href.includes("/songs")){
            let folder=e.href.split("/").slice(-1)[0];
            if(folder!="songs"){

            let a=await fetch(`https://127.0.0.1:5500/Spotify/songs/${folder}/info.json`);
            let response=await a.json();
            

            cardContainer.innerHTML=cardContainer.innerHTML+ 
                                    `<div data-folder="${folder}" class="card">

                        <div class="play">
                            <div class="svg-container">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                    <circle cx="12" cy="12" r="12" class="circle-background"/>
                                    <svg x="2" y="2" width="26" height="26" viewBox="0 0 30 30">
                                        <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" class="play-button"/>
                                    </svg>
                                </svg>
                            </div>           
                            
                        </div>
                        <img src="http://127.0.0.1:5500/Spotify/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
                
            }
            //get metadata
        }
    }

    //load playlist whenever card is clicked
    Array.from(document.getElementsByClassName('card')).forEach( e => {
        
        e.addEventListener('click',(item)=>{           
            getSongs(`songs/${item.currentTarget.dataset.folder}`);

        })
        
    })

    



 
    document.querySelector('.songTime').innerHTML=`${convertSecondsToMinuteSeconds(currSong.currentTime)}/${convertSecondsToMinuteSeconds(currSong.duration)}`;

}



async function main(){

    await getSongs("songs/gym");
    //playMusic(songs[0],true);
    
    
    

    //display albums
    await displayAlbums();

    

    
    
    //listen for time update
    

    //attach event listener to each playbutton
    play.addEventListener('click',(e)=>{
        if(currSong.paused){
            currSong.play();
            play.src="img/pause.svg"

        }
        else{
            currSong.pause();
            play.src="img/play.svg"

        }

    })



    //add eventlistner to seekbar
    document.querySelector(".seekbar").addEventListener('click',(e)=>{
        console.log(e.target,e.offsetX);
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector('.circle').style.left=(percent)+"%";
        currSong.currentTime=((currSong.duration)*percent)/100;
    })

    //play first song
    //var audio=new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(duration);
    //     // The duration variable now holds the duration (in seconds) of the audio clip
    // });

    document.querySelector('#hamburger').addEventListener('click',()=>{
        document.querySelector('.left').style.left="0";
    })

    document.querySelector('#crossbtn').addEventListener('click',()=>{
        document.querySelector('.left').style.left="-100%";
    })

    
    //adding prev and next btn functionality
    document.querySelector("#prev").addEventListener('click',()=>{
        console.log(songs);
        console.log(currSong.src.split('/').slice(-1)[0]);
        
        let index=songs.indexOf(currSong.src.split('/').slice(-1)[0]);
        console.log(index)
        if((index-1)>=0){
            playMusic(songs[index-1])
        }

    })

    document.querySelector("#next").addEventListener('click',()=>{
        //console.log(currSong.src.split('/').slice(-1)[0])
        //currSong.pause();
        let index=songs.indexOf(currSong.src.split('/').slice(-1)[0]);
        console.log(index)
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }

    })

    //adding volume button
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change',(e)=>{
        console.log(e,e.target,e.target.value);
        currSong.volume=parseInt(e.target.value)/100;
    })

    //adding mute button
    document.querySelector('.volume>img').addEventListener('click',(e)=>{
        if(e.target.src.includes('img/volume.svg')){
            e.target.src=e.target.src.replace('img/volume.svg','img/mute.svg');
            currSong.volume=0;
            document.querySelector('.range').getElementsByTagName('input')[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace('img/mute.svg','img/volume.svg');
            currSong.volume=1;
            document.querySelector('.range').getElementsByTagName('input')[0].value=100;
        }
    })
    

}

main();

