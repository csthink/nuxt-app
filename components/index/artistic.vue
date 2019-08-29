<template>
  <section class="m-istyle">
    <dl @mouseover="over">
      <dt>有格调</dt>
      <dd :class="{ active: kind === 'all' }" kind="all" keyword="景点">
        全部
      </dd>
      <dd :class="{ active: kind === 'part' }" kind="part" keyword="美食">
        约会聚餐
      </dd>
      <dd :class="{ active: kind === 'spa' }" kind="spa" keyword="丽人">
        丽人SPA
      </dd>
      <dd :class="{ active: kind === 'movie' }" kind="movie" keyword="电影">
        电影演出
      </dd>
      <dd :class="{ active: kind === 'travel' }" kind="travel" keyword="旅游">
        品质出游
      </dd>
    </dl>
    <ul class="ibody">
      <li v-for="item in current" :key="item.title">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img :src="item.img" class="image" />
          <ul class="cbody">
            <li class="title">{{ item.title }}</li>
            <li class="pos">
              <span>{{ item.pos }}</span>
            </li>
            <li class="price">
              ￥<em>{{ item.price }}</em
              ><span>/起</span>
            </li>
          </ul>
        </el-card>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data: () => {
    return {
      kind: 'all',
      list: {
        all: [
          {
            title: 'all-1',
            pos: 'test pos',
            price: Math.ceil(Math.random() * 400),
            img: '//p0.meituan.net/poi/__4783417__9671691.jpg@736w_416h_1e_1c',
            url: '#'
          },
          {
            title: 'all-2',
            pos: 'test pos',
            price: Math.ceil(Math.random() * 400),
            img: '//p0.meituan.net/poi/__4783417__9671691.jpg@736w_416h_1e_1c',
            url: '#'
          }
        ],
        part: [
          {
            title: 'part-1',
            pos: 'test pos',
            price: Math.ceil(Math.random() * 400),
            img: '//p0.meituan.net/poi/__4783417__9671691.jpg@736w_416h_1e_1c',
            url: '#'
          }
        ],
        spa: [
          {
            title: 'spa title1',
            pos: 'test pos',
            price: Math.ceil(Math.random() * 400),
            img: '//p0.meituan.net/poi/__4783417__9671691.jpg@736w_416h_1e_1c',
            url: '#'
          },
          {
            title: 'spa title2',
            pos: 'test pos',
            price: Math.ceil(Math.random() * 400),
            img: '//p0.meituan.net/poi/__4783417__9671691.jpg@736w_416h_1e_1c',
            url: '#'
          }
        ],
        movie: [
          {
            title: 'movie title',
            pos: 'test pos',
            price: Math.ceil(Math.random() * 400),
            img: '//p0.meituan.net/poi/__4783417__9671691.jpg@736w_416h_1e_1c',
            url: '#'
          },
          {
            title: 'movie title',
            pos: 'test pos',
            price: Math.ceil(Math.random() * 400),
            img: '//p0.meituan.net/poi/__4783417__9671691.jpg@736w_416h_1e_1c',
            url: '#'
          }
        ],
        travel: [
          {
            title: 'travel title1',
            pos: 'test pos',
            price: Math.ceil(Math.random() * 400),
            img: '//p0.meituan.net/poi/__4783417__9671691.jpg@736w_416h_1e_1c',
            url: '#'
          },
          {
            title: 'travel title2',
            pos: 'test pos',
            price: Math.ceil(Math.random() * 400),
            img: '//p0.meituan.net/poi/__4783417__9671691.jpg@736w_416h_1e_1c',
            url: '#'
          }
        ]
      }
    }
  },
  computed: {
    current() {
      return this.list[this.kind]
    }
  },
  methods: {
    over(e) {
      const dom = e.target
      const tag = dom.tagName.toLowerCase()
      if (tag === 'dd') {
        this.kind = dom.getAttribute('kind')
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/index/artistic.scss';
</style>
