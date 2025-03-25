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