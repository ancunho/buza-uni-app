<template>
	<view class="content container">
		<view class="title-content">Category</view>
		<view class="top-category">
			<view 	v-bind:class="idx == onLoadIdx ? 'top-category-item-on' : ''" class="top-category-item" 
					v-for="(item, idx) in lstCategory"
					@click="handleGetPostListByCodeName(item,idx)">
				<text class="top-category-item-text">{{item.codeName}}</text>
			</view>
		</view>
		<view class="post-list">
			<view class="post-list-item" v-for="(item, idx) in lstPost" >
				<view class="post-list-item-image">
					<image mode="scaleToFill" 
							:src="item.postThumbnailBig || ''"
					></image>
				</view>
				<view class="post-list-item-title">{{item.postTitle}}</view>
				<view class="post-list-item-date">{{item.createTime}}</view>
			</view>
			<!-- <view v-for="(item, idx) in lstPost">
				<view>{{ item.postTitle }}</view>
			</view> -->
		</view>
		<!-- <view @click="handleGetUserInfo">Button</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageError: '',
				title: 'Hello World',
				formData: null,
				openId: '',
				lstCategory: [],
				lstPost:[],
				onLoadIdx: 0,
				page: 1,
				limit: 15,
				// candidates: ['北京', '南京', '东京', '武汉', '天津', '上海', '海口'],
				// city: ''
			}
		},
		async onLoad() {
			let _this = this;
			_this.$utils.showLoading();
			// Get openId   
			if (uni.getStorageSync("openId") == "") {
				const code = await _this.onGetWechatCode();
				var params = {
					code
				};
				_this.$http.getOpenId(params).then(res => {
					if (res.status === 200) {
						_this.openId = res.data.openId;
						uni.setStorageSync("openId", res.data.openId);
					} else {
						uni.showToast({
							title: "Error"
						});
					}
				}).catch(resError => {
					uni.showToast({
						title: "Error"
					})
				});
			}
			await _this.$http.getPostCategory().then(res => {
				_this.$utils.hideLoading();
				if (res.code != 0) {
					_this.$utils.msg("获取错误");
				} else {
					_this.lstCategory = res.data;
					if (_this.lstCategory.length > 0) {
						var params = {
							postType: _this.lstCategory[0].codeId,
							page: _this.page,
							limit: _this.limit
						};
						// const postListResult = _this.$http.getPostListByCodeName(params);
						// _this.lstCategory = postListResult.data;
						_this.$http.getPostListByCodeName(params).then(resPostList => {
							_this.lstPost = resPostList.data;
							console.log(_this.lstPost);
						}).catch(resErrorPostList => {
							_this.$utils.msg("获取错误");
						});
					}
				}
			}).catch(resError => {
				_this.$utils.hideLoading();
			});
		},
		methods: {
			handleGetUserInfo() {
				let _this = this;
				// _this.onGetUserInfo();
			},
			async handleGetPostListByCodeName(item, idx) {
				let _this = this;
				_this.onLoadIdx = idx;
				var params = {
					postType: item.codeId,
					page: _this.page,
					limit: _this.limit
				};
				await _this.$http.getPostListByCodeName(params).then(resPostList => {
					_this.lstPost = resPostList.data;
				}).catch(resErrorPostList => {
					_this.$utils.msg("获取错误");
				});
			},
			async onGetUserInfo() {
				let _this = this;
				// 获取用户信息
				// const userInfo = await _this.onWechatInfo();
				// var params = {};
				// const result2 = await _this.$http.getPostCategory(params);
			},
			async onWechatInfo() {
				let _this = this;
				return new Promise((resolve, reject) => {
					if (!uni.canIUse('getUserProfile')) return null;
					uni.getUserProfile({
						lang: 'zh_CN',
						desc: 'huqo',
						success: res => {
							_this.formData = res.userInfo;
							uni.getLocation({
								type: 'gcj02',
								success: resLocation => {
									_this.formData.latitude = resLocation.latitude;
									_this.formData.longitude = resLocation.longitude;
								},
								fail: err => {
									uni.showToast({
										title: 'Error',
										icon: 'fail'
									});
								}
							})
							return resolve(res.userInfo);
						},
						fail: err => {
							uni.showToast({
								title: '用户拒绝了授权',
								icon: 'fail'
							});
							return reject(err);
						}
					})
				});
			},
			async onGetWechatCode() {
				const [providerErr, providerData] = await uni.getProvider({
					service: 'oauth'
				});
				if (providerErr) return uni.showToast({
					title: '没有获取到服务商',
					icon: "none"
				});
				const provider = providerData.provider;
				if (provider.includes('weixin')) {
					const options = {
						provider: provider[0] // 'weixin'
					};
					const loginOnData = await uni.login(options);
					const [loginErr, loginData] = loginOnData;
					if (loginErr) return uni.showToast({
						title: loginErr,
						icon: 'none'
					});
					return loginData.code;
				}
				return null;
			}
		}
	}
</script>

<style>
	.post-list-item {
		position:relative;
		display: flex;
		padding:0 15px 15px 15px;
		justify-content: flex-start;
		margin-bottom: 15px;
		
		border-bottom: 1px solid #F3F4F6;
	}
	.post-list-item-image image {
		border:1px solid #ddd; border-radius: 10px;
		width: 120px; height: 80px; background-color: #eeeeee;
		margin-right:10px;
	}
	.post-list-item-title {
		color:#4B5563; font-size: 1.05rem; font-weight: bold;
	}
	.post-list-item-date {
		position:absolute; bottom:15px; right:15px; font-size:0.7rem;
	}
	.title-content {
		font-size: 1rem;
		font-weight: bold;
		color: #374151;
		margin: 10px 10px 0 15px;
	}

	.top-category {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		overflow-x: auto;
		padding: 10px;
	}

	.top-category-item {
		padding: 0 10px;
		margin: 0 5px 15px 5px;
		line-height: 55px;
		text-align: center;
		border: 2px solid #9CA3AF;
		color:#9CA3AF;
		font-weight: bold;
		cursor: pointer;
		border-radius: 10px;
		box-shadow: 2px 2px 5px #e5e7eb;
	}

	.top-category-item.top-category-item-on,
	.top-category-item:hover,
	.top-category-item:active,
	.top-category-item:focus {
		border-color: #1F2937;
		color: #1F2937;
		background-color: #ffffff;
		box-shadow: 2px 4px 9px #e5e7eb;
	}

	.top-category-item-text {
		font-size: 0.80rem;
		font-weight: bolder;
	}

	.content {}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
