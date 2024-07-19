import { Router } from "express"
import homeRouter from './home.route'
import topicRouter from './topic.route'
import songRouter from './song.route'
import singerRouter from './singer.route'

import prefixAdmin from "../../config/prefix.config"

const router: Router = Router()

router.use(`${prefixAdmin}/home`, homeRouter)

router.use(`${prefixAdmin}/topics`, topicRouter)

router.use(`${prefixAdmin}/songs`, songRouter)

router.use(`${prefixAdmin}/singers`, singerRouter)

export default router
