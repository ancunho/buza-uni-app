<template>
	<view class="content container">
		<view class="title-content">카테고리</view>
		<view class="top-category">
			<view 	v-bind:class="idx == onLoadIdx ? 'top-category-item-on' : ''" class="top-category-item" 
					v-for="(item, idx) in lstCategory" v-bind:key="idx"
					@click="handleGetPostListByCodeName(item,idx)">
				<text class="top-category-item-text">#{{item.codeName}}</text>
			</view>
		</view>
		<view class="post-title"></view>
		<view class="post-list">
			<view class="post-list-item" v-for="(item, idx) in lstPost" v-bind:key="idx">
				<view class="post-list-item-image">
					<image mode="widthFix" 
							:src="item.postThumbnailBig || ''"
							@click="handleClickDetail(item)"
					></image>
				</view>
				<view class="post-list-item-title" @click="handleClickDetail(item)">{{item.postTitle}}</view>
				<view class="post-list-item-remark">
					<view class="post-list-item-date">Date.{{item.createTime}}</view>
					<uni-icons class="post-list-item-like" @click="handleClickHeart(item)" type="heart" size="30"></uni-icons>
				</view>
			</view>
		</view>
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
				showLeft: false,
				userInfo: {},
				customerDto: {},
				// candidates: ['北京', '南京', '东京', '武汉', '天津', '上海', '海口'],
				// city: ''
			}
		},
		async onLoad() {
			let _this = this;
			_this.$utils.showLoading();
			// Get openId
			if (uni.getStorageSync("openId") == "") {
				// Get code
				const code = await _this.onGetWechatCode().then(code => {
					return code;
				}).catch(resError => {
					uni.showToast({
						icon:'error',
						title: "获取code失败"
					})
					return;
				}); 
				
				await _this.$http.getOpenId({code}).then(res => {
					if (res.status === 200) {
						_this.openId = res.data.openId;
						uni.setStorageSync("openId", res.data.openId);
					} else {
						uni.showToast({
							icon:'error',
							title: "无法获取OpenId，请确认网络"
						});
					}
				}).catch(resError => {
					uni.showToast({ 
						title: "Error"
					});
					return;
				});
			}
			
			// get customer info by openId
			// await _this.$http.getCustomerByDto({openId: uni.getStorageSync("openId")}).then(res => {
			// 	_this.userInfo = res.data == undefined ? "" : res.data;
			// 	uni.setStorageSync("userInfo", _this.userInfo);
			// }).catch(resError => {
			// 	uni.showToast({
			// 		icon:'error',
			// 		title: "Welcome!"
			// 	})
			// })
			
			// Get Post Category
			await _this.$http.getPostCategory().then(res => {
				_this.$utils.hideLoading();
				if (res.code != 0) {
					_this.$utils.msg("获取错误");
				} else {
					_this.lstCategory = res.data;
					if (_this.lstCategory.length > 0) {
						// Get post list by codeName
						var params = {
							postType: _this.lstCategory[0].codeId,
							page: _this.page,
							limit: _this.limit
						};
						_this.$http.getPostListByCodeName(params).then(resPostList => {
							_this.lstPost = resPostList.data;
						}).catch(resErrorPostList => {
							_this.$utils.msg("获取错误");
						}); 
					}
				}
			}).catch(resError => {
				_this.$utils.hideLoading();
			});
			
		},
		onPullDownRefresh() {
			let _this = this;
			_this.$http.getPostCategory().then(res => {
				uni.stopPullDownRefresh();
				if (res.code != 0) {
					_this.$utils.msg("获取错误");
				} else {
					_this.lstCategory = res.data;
				}
			}).catch(resError => {
				uni.showToast({
					icon:'error',
					title:"Error!"
				});
			});
		},
		methods: {
			async handleClickHeart(item) {
				let _this = this;
				if(uni.getStorageSync("userInfo") == "") {
					// 判断能否使用 getUserProfile接口
					if (!uni.canIUse('getUserProfile')) {
						uni.showToast({
							title: "无法获取getUserProfile",
							icon: 'error'
						})
						return null;	
					}
					// 获取getUserProfile
					const [profileError, profileData] = await uni.getUserProfile({
						lang: 'zh_CN',
						desc: 'huqo'
					}).then(res => {
						return res;
					}).catch(resError => {
						return resError;
					});
					
					if (profileError) {
						_this.$utils.errorMsg("用户拒绝了授权");
						return;
					}
					
					const userInfo = profileData.userInfo;
					userInfo.openId = uni.getStorageSync("openId");
					userInfo.status = '1';
					uni.setStorageSync("userInfo", userInfo);
					
					
					// get customer info by openId
					await _this.$http.procCustomer(userInfo);
					// await _this.$http.procCustomer(userInfo).then(res => {
					// 	if (res.code === 0) {
					// 		// _this.$utils.msg("保存用户信息成功");
					// 	} else {
					// 		_this.$utils.errorMsg("保存用户信息失败");
					// 	}
					// }).catch(resError => {
					// 	_this.$utils.errorMsg("procCustomer Error!");
					// });
				}
				
				const userInfoStorage = uni.getStorageSync("userInfo");
				
				// await _this.$http.getCustomerById(userInfoStorage).then(resById => {
				// 	if (resById.code == 0) {
						
				// 	} else {
						
				// 	}
				// }).catch(resErrorById => {
				// 	_this.$utils.errorMsg("获取用户信息失败");
				// })
			},
			handleClickDetail(item) {
				let _this = this;
				uni.navigateTo({
					url: 'post_detail?postId=' + item.postId,
					animationType: 'pop-in',
					animationDuration: 200
				})
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
			async onWechatInfo() {
				let _this = this;
				return new Promise((resolve, reject) => {
					
					uni.getUserProfile({
						lang: 'zh_CN',
						desc: 'huqo'
					}).then(res => {
						_this.formData = res.userInfo;
						resolve(res.userInfo);
					}).catch(resError => {
						_this.$utils.errorMsg("用户拒绝了授权");
						reject(err);
					})
				}).catch(promiseError => {
					_this.$utils.errorMsg("获取用户信息失败");
				});
			},
			async onGetWechatCode() {
				const [providerErr, providerData] = await uni.getProvider({
					service: 'oauth'
				}).then(res => {
					return res;
				}).catch(resError => {
					return resError;
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
					const loginOnData = await uni.login(options).then(res => {
						return res;
					}).catch(resError => {
						return null;
					});
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
		margin-bottom: 15px;
		padding: 15px;
		border-bottom: 1px solid #cbd5e1;
	}
	.post-list-item-image image { border-radius: 5px; width:100%; background-color: #eeeeee; }
	.post-list-item-title {
		line-height: 1.5rem; padding: 7px; color:#4B5563; font-size: 1.05rem; font-weight: bold;
	}
	.post-list-item-remark {
		display:flex;
		justify-content: space-between;
		align-items: center;
	}
	.post-list-item-date {
		 font-size:0.7rem; color:#9CA3AF; padding: 0 7px;
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
