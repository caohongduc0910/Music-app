import { Router } from "express"

import topicRouter from './topic.route'
import songRouter from './song.route'
import favoriteSongRouter from './favorite-song.route'
import searchRouter from './search.route'

const router: Router = Router()

router.use('/topics', topicRouter)

router.use('/songs', songRouter)

router.use('/favorite-songs', favoriteSongRouter)

router.use('/search', searchRouter)

export default router
