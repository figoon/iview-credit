<template>
	<Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu">
		<template v-for="(item, index) in menuList">
			<MenuItem v-if="item.children.length<=1" :name="item.children[0].name" :key="item.index">
				<Icon :type="item.icon" :size="iconSize" :key="item.index"></Icon>
				<span class="layout-text" :key="item.index">{{ itemTitle(item) }}</span>
			</MenuItem>
			<Submenu v-if="item.children.length > 1" :name="item.name" :key="item.name">
				<template slot="title">
					<Icon :type="item.icon" :size="iconSize"></Icon>
					<span class="layout-text">{{ itemTitle(item) }}</span>
				</template>
				<template v-for="(child, index) in item.children">
					<MenuItem :name="child.name" :key="child.index">
						<Icon :type="child.icon" :size="iconSize" :key="child.index"></Icon>
						<span class="layout-text" :key="child.index">{{ itemTitle(child) }}</span>
					</MenuItem>
				</template>
			</Submenu>
			
		</template>
	</Menu>
</template>

<script>
	export default {
		name: 'sidebarMenu',
		props: {
			menuList: Array,
			iconSize: Number,
			menuTheme: {
				type: String,
				default: 'dark'
			},
			openNames: {
				type: Array
			}
		},
		methods: {
			changeMenu (active) {
				this.$emit('on-change', active);
			},
			itemTitle (item) {
				if (typeof item.title === 'object') {
					return this.$t(item.title.i18n);
				} else {
					return item.title;
				}
			}
		},
		updated () {
			this.$nextTick(() => {
				if (this.$refs.sideMenu) {
					this.$refs.sideMenu.updateOpened();
				}
			});
		}

	};
</script>

<style lang="less">
	@import '../../../../styles/common/menu.less';
</style>