<template>
	<view class="content">
		<view class="title-content">Category</view>
		<view class="top-category">
			<view 	v-bind:class="idx == onLoadIdx ? 'top-category-item-on' : ''" class="top-category-item" 
					v-for="(item, idx) in lstCategory"
					@click="handleGetPostListByCodeName(item,idx)">
				<text class="top-category-item-text">{{item.codeName}}</text>
			</view>
		</view>
		<view class="post-list">
			<view v-for="(item, idx) in lstPost">
				<view>{{ item.postTitle }}</view>
			</view>
		</view>
		<!-- <view @click="handleGetUserInfo">Button</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello World',
				formData: null,
				openId: '',
				lstCategory: [],
				lstPost:[],
				onLoadIdx: 0,
				page: 1,
				limit: 15
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
					console.log(_this.lstPost);
				}).catch(resErrorPostList => {
					_this.$utils.msg("获取错误");
				});
			},
			async onGetUserInfo() {
				let _this = this;
				// 获取用户信息
				// const userInfo = await _this.onWechatInfo();
				var params = {};
				const result2 = await _this.$http.getPostCategory(params);
				console.log(result2);
			},
			async onWechatInfo() {
				let _this = this;
				return new Promise((resolve, reject) => {
					if (!uni.canIUse('getUserProfile')) return null;
					uni.getUserProfile({
						lang: 'zh_CN',
						desc: 'huqo',
						success: res => {
							console.log('用户同意了授权', res);
							_this.formData = res.userInfo;
							uni.getLocation({
								type: 'gcj02',
								success: resLocation => {
									_this.formData.latitude = resLocation.latitude;
									_this.formData.longitude = resLocation.longitude;
								},
								fail: err => {
									console.log(err);
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
	.title-content {
		font-size: 1rem;
		font-weight: bold;
		color: #374151;
		padding: 10px 10px 0 10px;
	}

	.top-category {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		overflow-x: auto;
		margin: 10px 0;
	}

	.top-category-item {
		width: 80px;
		margin: 0 5px 15px 5px;
		line-height: 55px;
		text-align: center;
		border: 1px solid #d1d5db;
		cursor: pointer;
		border-radius: 10px;
		box-shadow: 2px 2px 5px #e5e7eb;
	}

	.top-category-item.top-category-item-on,
	.top-category-item:hover,
	.top-category-item:active,
	.top-category-item:focus {
		border-color: #00c3bd;
		color: #00c3bd;
		background-color: #f8fafc;
	}

	.top-category-item-text {
		font-size: 0.85rem;
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
