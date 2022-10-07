<template>
	<view>
		<image class="post-detail-big-image" mode="widthFix" :src="postDetail.postThumbnailBig"></image>
		<view class="post-detail">
			<view class="post-detail-title">{{postDetail.postTitle}}</view>
			<view class="post-detail-date">{{postDetail.createTime}}</view>
			<mp-html class="post-detail-content" :content="postDetail.postContent"></mp-html>
			<!-- <view class="post-detail-content" v-html="postDetail.postContent"></view> -->
		</view>
	</view>
</template>

<script>
	var graceRichText = require("../../utils/rich_text.js");
	export default {
		data() {
			return {
				postDetail: {},
			}
		},
		onLoad(option) {
			let _this = this;
			console.log(option);
			_this.onGetPostById(option.postId);
		},
		methods: {
			async onGetPostById(postId) {
				let _this = this;
				console.log(postId);
				var params = { postId };
				await _this.$http.getPostDetailByPostId(params).then(res => {
					if(res.code != 0) {
						_this.$utils.msg(res.msg);
						uni.navigateTo({
							url: '/pages/index/index'
						});
					} else {
						_this.postDetail = res.data;
						_this.postDetail.postContent = graceRichText.format(_this.postDetail.postContent);
					}
				}).catch(resError => {
					console.log(resError);
				});
			}
		}
	}
</script>

<style>
	.post-detail {padding: 10px 15px;}
	.post-detail-big-image { width: 100%; }
	.post-detail-title { font-size: 1.2rem; font-family: 'HallymGothic-Regular';}
	.post-detail-date {margin-top: 7px; font-size: 0.7rem; font-family: 'HallymGothic-Regular';}
	.post-detail-content { margin-top:15px; padding: 20px 0; border-top:1px solid #F3F4F6;}
</style>