import Router from 'koa-router';
import userModel from '../../lib/mysql.js';
import moment from 'moment';
const router = new Router();

//新增文章
router.post('/system/posts/insert', async(ctx, next) => {
  const post = ctx.request.body;
  await userModel.insertPost(
    [post.name, moment().format('YYYY-MM-DD HH:mm:ss'), post.title, post.tags]
  ).then(async(res) => {
    ctx.body = {
      success: true,
      msg: '新增文章成功',
      data: res[0]
    }
  }).catch((err) => {
    console.log(err);
    ctx.body = {
      msg: err
    }
  });
});
//查找分页文章
router.post('/system/posts', async(ctx, next) => {
  await userModel.findPostsByPage(ctx.request.body.pageNo, ctx.request.body.pageSize)
    .then((res) => {
      ctx.status = 200;
      ctx.body = {
        success: true,
        msg: '查询成功',
        data: res
      }
    }).catch((err) => {
      console.log(err);
      ctx.body = {
        msg: err
      }
    })
});

//根据id查找文章
router.get('/system/posts/:id', async(ctx, next) => {
  await userModel.findPostById(ctx.params.id)
    .then(async(res) => {
      //更新文章浏览数
      await userModel.updatePostView([ctx.params.id])
        .then((result) => {
          ctx.status = 200;
          ctx.body = {
            success: true,
            msg: '查询成功',
            data: result[0]
          };
        });
    }).catch((err) => {
      console.log(err);
      ctx.body = {
        msg: err
      }
    })
});

export default router;