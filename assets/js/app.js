
/*
    1 render song
    2 Scroll top
    3 play/ pause/ seek
    4 cd rotate
    5 next/ prev
    6 random
    7.next / repeat when ended
    8. active song
    9 . Scroll active song into view
    10 . play song when click
*/
const $ =document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const playList = $('.playlist')
const app = {
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    songs : [
        {
            name:'Ngôi Sao Cô Đơn',
            singer:'Jack',
            path:'./assets/music/song1.mp3',
            img:'./assets/img/img1.jpg'
        },
        {
            name:'Thiêu Thân',
            singer:'B Ray & Sofia & Chau Dang Khoa',
            path:'./assets/music/song2.mp3',
            img:'./assets/img/img2.png'
        },
        {
            name:'Có chuyện cùng chill',
            singer:'WOWY x LOW G x NÂN x MASEW',
            path:'./assets/music/song3.mp3',
            img:'./assets/img/img3.jpg'
        },
        {
            name:'Bắt cóc con tim',
            singer:'Lou Hoang',
            path:'./assets/music/song4.mp3',
            img:'./assets/img/img4.jpg'
        },
        {
            name:'Nơi này có anh',
            singer:'Son Tung',
            path:'./assets/music/song5.mp3',
            img:'./assets/img/img5.jpg'
        },
    ],
       
    render: function()
    {
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb"

                style="background-image: url('${song.img}')" >
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>

            `
        })
        $('.playlist').innerHTML = htmls.join('')
       
    },

    // getCurrentSong: function(){
    //     return this.songs[this.currentIndex]
    // },

    // lấy tất cả các danh sách bài hát
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
           
        })
    },

    // xử lí sự kiện
    handleElments:function()
    {
        const _this = this
        const cdWidth = cd.offsetWidth

        // xử lý cd quay / dừng
     const cdThumbAnimate =    cdThumb.animate([
            { transform:'rotate(360deg)'}
        ],{
            duration: 10000,
            iteration:Infinity
        })
        // xét lúc đầu cái đĩa ko cho quay
        cdThumbAnimate.pause()

        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCD = cdWidth - scrollTop
            
            // thu nhỏ cd nếu newCD > 0 thì lấy newCD + "px" còn ngược lại thì cho nó giá trị bằng 0
            cd.style.width = newCD > 0 ? newCD + "px" : 0
            // làm mờ cd
            cd.style.opacity = newCD / cdWidth
        }
        // Xử lý khi click nút play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play() 
            }
        }
        // khi song được play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
       // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            const progressPercent = Math.floor(audio.currentTime / audio.duration*100)
            progress.value = progressPercent
        }
        // tua bài hát 
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // next bài hát
        btnNext.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }
            else
            {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
         // prev bài hát
         btnPrev.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }
            else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        // xử lý bật tắt random
        btnRandom.onclick = function(e){
            _this.isRandom = !_this.isRandom
            btnRandom.classList.toggle('active',_this.isRandom)
        }
        // Xử lý next song khi bài hát kết thúc
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }
            else{
                btnNext.onclick()
            }
           
        }
        // xử lý khi repeat bài hát 
        btnRepeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            btnRepeat.classList.toggle('active',_this.isRepeat)
        } 

        // lăng nghe hành vi click vào playList
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(active)')
            if(songNode || e.target.closest('.option')){
                // xu ly khi click vao song
               if(songNode){
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
               }
            }
        } 
    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'end',
            })
        },500)
    }
    ,
    loadCurrentSong: function(){
       
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path

    },

    nextSong: function(){
        this.currentIndex++
       // console.log(this.currentIndex >= this.songs.length)
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function(){
        // Định nghĩa các thuộc tính cho object
        app.defineProperties()

        // lắng nghe xử lý sự kiện
        app.handleElments()

        // load bài hát đầu tiên khi chạy UI
        app.loadCurrentSong()

        //render playList
        app.render()
    }
}

app.start()