<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view @click="handleGetUserInfo">Button</view>
	</view> 
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello World',
				formData: null,
				openId: '',
			}
		},
		async onLoad() {
			let _this = this;
			// Get openId  
			if (uni.getStorageSync("openId") == "") {
				const code = await _this.onGetWechatCode();
				var params = {code};
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
		},
		methods: {
			handleGetUserInfo() {
				let _this = this;
				_this.onGetUserInfo();
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
							console.log('用户同意了授权',res);
							_this.formData = res.userInfo;
							uni.getLocation({
								type: 'gcj02',
								success: resLocation => {
									_this.formData.latitude = resLocation.latitude;
									_this.formData.longitude = resLocation.longitude;
								},
								fail:err => {
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
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
