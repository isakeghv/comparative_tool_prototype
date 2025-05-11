//returns true if file is image-file
export const isImage = (file) => {
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const extension = file.slice(file.lastIndexOf('.')).toLowerCase();
    return extensions.includes(extension);
}

export const isPdf = (file) =>{
    return file.slice(file.lastIndexOf('.')).toLowerCase().includes('pdf')
}

//returns true if file is audio-file
export const isAudioFile = (file) => {
    const extensions = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma']
    const extension = file.slice(file.lastIndexOf('.')).toLowerCase();
    return extensions.includes(extension);
}

//returns true if the file is a video file
export const isVideoFile = (file) => {
    const extensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.mpeg'];
    const extension = file.slice(file.lastIndexOf('.')).toLowerCase();
    return extensions.includes(extension);
}

// import { toRaw } from '@vue/reactivity';

// // https://stackoverflow.com/questions/58054479/how-can-i-save-some-json-dataarray-on-button-click-as-somename-json-fil
// export const exportAsJson = (data) => {
//     const rawData = toRaw(data.value); 
//     const str = JSON.stringify(rawData);
//     const blob = new Blob([str], { type: 'application/json' });
//     const element = document.createElement('a');
  

//     element.href = URL.createObjectURL(blob);
//     element.download = "answers.json";
  
//     // trigger the download, then remove the element after downloading
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
// }