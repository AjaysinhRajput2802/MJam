global_args.getFiles.then((files) => {
    for(i = 0; i < files.length; i++){
        global_args.getTags(files[i]).then((tags) => {
            content_frame.all_songs.push(tags);
        })
    }
});

global_args.getRecent.then((songs) => {
    for(i = 0; i < songs.length; i++){
        content_frame.recent_songs.push(songs[i]);
    }

})

let content_frame = new Vue({
    el: ".main-frame",
    data: {
        frame: 'home',
        all_songs: [],
        recent_songs: []
    },
    methods: {
        playMe: function(src){
            global_args.load(src);
            global_args.nowplaying.play();
        },
        updateFrame: function(frame){
            this.frame = frame;
        }
    }
})

let title_frame = new Vue({
    el: ".title-bar",
    data: {
        song: {
            title: "",
            artist: ""
        }
    },
    computed: {
        title: function(){
            if(this.song.title != "" && this.song.artist != ""){
                return this.song.title + " - " + this.song.artist;
            }
        }
    }
})

let right_frame = new Vue({
    el: "#right-frame",
    data: {
        artist_songs_sy: {},
        artists: []
    },
    computed: {
        artist_songs: function(){
            return this.artist_songs_sy;
        }
    }
})