//ADPlayer
const aplayer = document.querySelector('#aplayer')

if (aplayer) {
  const song = JSON.parse(aplayer.getAttribute('data-song'))
  const singer = JSON.parse(aplayer.getAttribute('data-singer'))

  const ap = new APlayer({
    container: aplayer,
    autoplay: true,
    volume: 1,
    lrcType: 1,
    audio: [{
      name: song.title,
      artist: singer.fullName,
      url: song.audio,
      cover: song.avatar,
      lrc: song.lyrics
    }]
  })


  const avatar = document.querySelector('.singer-detail .inner-avatar')
  //Toggle Avartar Animation
  //dung avt khi dung nhac
  ap.on('pause', function () {
    avatar.style.animationPlayState = "paused"
  })

  //xoay avt khi phat nhac
  ap.on('play', function () {
    avatar.style.animationPlayState = "running"
  })

  //dem luot nghe
  const songID = song._id
  setTimeout(ap.on('ended', function () {
    console.log(songID)
    const link = `/songs/listen/${songID}`

    fetch(link, {
      method: "PATCH",
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          const listen = document.querySelector('[data-listen]')
          listen.innerHTML = data.listen
        }
      })
  }), 90000)

}

//Like button
const likeButton = document.querySelector('.inner-action.inner-like')

if (likeButton) {
  const songID = likeButton.getAttribute('button-like')

  likeButton.addEventListener("click", () => {
    const isActive = likeButton.classList.contains('active')
    const type = isActive ? 'no' : 'yes'
    const link = `/songs/like/${type}/${songID}`
    likeButton.classList.toggle('active')

    fetch(link, {
      method: "PATCH",
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          const like = document.querySelector('[data-like]')
          like.innerHTML = data.currentLike
        }
      })
  })
}


//Favorite button
const listFavoriteButton = document.querySelectorAll('.inner-heart')

if (listFavoriteButton.length > 0) {
  listFavoriteButton.forEach((favoriteButton) => {
    const songID = favoriteButton.getAttribute('button-favorite')

    favoriteButton.addEventListener("click", () => {
      const isActive = favoriteButton.classList.contains('active')
      const type = isActive ? 'no' : 'yes'
      const link = `/songs/favorite/${type}/${songID}`

      fetch(link, {
        method: "PATCH",
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            favoriteButton.classList.toggle('active')
          }
        })
    })
  })
}


//Search box
const searchBox = document.querySelector('.box-search')
if (searchBox) {
  const inputBox = searchBox.querySelector('input[name="keyword"]')
  searchBox.addEventListener('keyup', () => {
    console.log(inputBox.value)
    const link = `/search/suggest?keyword=${inputBox.value}`

    fetch(link)
      .then(res => res.json())
      .then(data => {
        const suggestBox = document.querySelector('.inner-suggest')
        if (data.songs.length > 0) {
          suggestBox.classList.add('show')
          const htmls = data.songs.map(song => {
            return ` 
            <a href="/songs/detail/${song.slug}" class="inner-item">
              <div class="inner-image"><img src="${song.avatar}"/></div>
              <div class="inner-info">
                <div class="inner-title">${song.title}</div>
                <div class="inner-singer">
                  <i class="fa-solid fa-microphone-lines"></i> ${song.singerName} 
                </div>
              </div>
            </a>`
          })
          const listBox = suggestBox.querySelector('.inner-list')
          listBox.innerHTML = htmls.join("")
        }
        else {
          suggestBox.classList.remove('show')
        }
      })
  })
}
