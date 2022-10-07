<template>
	<view class="content">
		<view style="width: 100%;">
			<swiper class="swiper" circular interval="3000" duration="500">
				<swiper-item>
					<image style="width: 100%;" mode="widthFix" src="../../static/bg-yours.jpg"></image>
				</swiper-item>
			</swiper>
		</view>
		<view style="margin-top: 20px;">
			<view style="text-align: center;">
				<image style="width:100px; height:100px; border-radius: 50px;" :src="userInfo.avatarUrl || avatarUrl" />
			</view>
			<text></text>
		</view>
		<view @click="handleGetUserInfo">{{userInfo.nickName || '点击登录'}}</view>
	</view> 
</template>

<script>
	export default {
		data() { 
			return {
				title: 'Hello World',
				formData: null,
				userInfo: {},
				openId: '',
				avatarUrl: '../../static/icon-mine.png',
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
			
			if (uni.getStorageSync("userInfo") != "") {
				_this.userInfo = uni.getStorageSync("userInfo");
			}
			
		},
		methods: {
			handleGetUserInfo() {
				let _this = this;
				_this.onWechatInfo().then(res => {
					_this.userInfo = res;
					_this.userInfo.openId = uni.getStorageSync("openId");
					uni.setStorageSync("userInfo", _this.userInfo);
				}).catch(err => {
					uni.showToast({
						title: "Error",
						icon:'error'
					});
				});
				
			},
			async onWechatInfo() {
				let _this = this;
				return new Promise((resolve, reject) => {
					if (!uni.canIUse('getUserProfile')) return null;
					uni.getUserProfile({
						lang: 'zh_CN',
						desc: 'getUserProfile',
						success: res => {
							// _this.userInfo = res.userInfo;
							// uni.getLocation({
							// 	type: 'gcj02',
							// 	success: resLocation => {
							// 		_this.formData.latitude = resLocation.latitude;
							// 		_this.formData.longitude = resLocation.longitude;
							// 	},
							// 	fail: err => {
							// 		uni.showToast({
							// 			title: 'Error',
							// 			icon: 'fail'
							// 		});
							// 	}
							// })
							return resolve(res.userInfo);
						},
						fail: err => {
							uni.showToast({
								title: '用户拒绝了授权',
								icon: 'error'
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
	.swiper {
		height: 300rpx;
		width: 100%;
	}
</style>
