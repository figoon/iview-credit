import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
	path: '/login',
	name: 'login',
	meta: {
		title: '零售信贷 - 登录'
	},
	component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
	path: '/*',
	name: 'error-404',
	meta: {
		title: '404-页面不存在'
	},
	component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
	path: '/403',
	meta: {
		title: '403-权限不足'
	},
	name: 'error-403',
	component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
	path: '/500',
	meta: {
		title: '500-服务端错误'
	},
	name: 'error-500',
	component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

export const preview = {
	path: '/preview',
	name: 'preview',
	component: resolve => { require(['@/views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
	path: '/locking',
	name: 'locking',
	component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
	path: '/',
	name: 'otherRouter',
	redirect: '/home',
	component: Main,
	children: [
		{ path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } },
		{ path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); } },
		{ path: 'order/:order_id', title: '订单详情', name: 'order-info', component: resolve => { require(['@/views/advanced-router/component/order-info.vue'], resolve); } }, // 用于展示动态路由
		{ path: 'shopping', title: '购物详情', name: 'shopping', component: resolve => { require(['@/views/advanced-router/component/shopping-info.vue'], resolve); } }, // 用于展示带参路由
		{ path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['@/views/message/message.vue'], resolve); } }
	]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
	{
		path: '/workbench',
		icon: 'home',
		name: 'workbench',
		title: '工作台',
		component: Main,
		children: [
			{ 
				path: 'daily', 
				title: '日常工作', 
				name: 'workbench_daily', 
				component: resolve => { require(['@/views/workbench/daily/daily.vue'], resolve); } 
			},
			{
				path: 'done', 
				title: '已办查询', 
				name: 'done_query', 
				component: resolve => { require(['@/views/workbench/done/done.vue'], resolve); } 
			}
		]
	},
	{
		path: '/customer',
		icon: 'person-stalker',
		name: 'customer',
		title: '客户管理',
		component: Main,
		children: [
			{ 
				path: 'acceptance', 
				title: '客户受理查询', 
				name: 'customer_acceptance', 
				component: resolve => { require(['@/views/customer/acceptance/acceptance.vue'], resolve); } 
			},
			{ 
				path: 'acceptance', 
				title: '预留位', 
				name: 'customer_test', 
				component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
			}
		]
	},
	{
		path: '/loan',
		icon: 'card',
		name: 'loan',
		title: '贷款管理',
		component: Main,
		children: [
			{ 
				path: 'acceptance', 
				title: '贷款受理查询', 
				name: 'loan_acceptance', 
				component: resolve => { require(['@/views/loan/acceptance/acceptance.vue'], resolve); } 
			},
			{ 
				path: 'approval', 
				title: '审批贷款查询', 
				name: 'loan_approval', 
				component: resolve => { require(['@/views/loan/approval/approval.vue'], resolve); } 
			}
		]
	},
	{
		path: '/log',
		icon: 'bug',
		name: 'log',
		title: '日志管理',
		component: Main,
		children: [
			{ 
				path: 'system', 
				title: '系统日志', 
				name: 'log_system', 
				component: resolve => { require(['@/views/log/system/system.vue'], resolve); } 
			},
			{ 
				path: 'system', 
				title: '预留位', 
				name: 'log_test', 
				component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
			}
		]
	},
	{
		path: '/system',
		icon: 'gear-b',
		name: 'system',
		title: '系统管理',
		component: Main,
		children: [
			{ 
				path: 'dictionaries', 
				title: '字典管理', 
				name: 'system_dictionaries', 
				component: resolve => { require(['@/views/system/dictionaries/dictionaries.vue'], resolve); } 
			},
			{ 
				path: 'dictionaries', 
				title: '预留位', 
				name: 'system_test', 
				component: resolve => { require(['@/views/system/dictionaries/dictionaries.vue'], resolve); } 
			}
		]
	},
	{
		path: '/users',
		icon: 'person',
		name: 'users',
		title: '用户管理',
		component: Main,
		children: [
			{ 
				path: 'role', 
				title: '角色管理', 
				name: 'users_role', 
				component: resolve => { require(['@/views/users/role/role.vue'], resolve); } 
			},
			{ 
				path: 'organization', 
				title: '机构管理', 
				name: 'users_organization', 
				component: resolve => { require(['@/views/users/organization/organization.vue'], resolve); } 
			},
			{ 
				path: 'user', 
				title: '用户管理', 
				name: 'users_user', 
				component: resolve => { require(['@/views/users/user/user.vue'], resolve); } 
			}
		]
	},
	{
		path: '/flow',
		icon: 'clipboard',
		name: 'flow',
		title: '流程管理',
		component: Main,
		children: [
			{ 
				path: 'deploy', 
				title: '部署流程', 
				name: 'flow_deploy', 
				component: resolve => { require(['@/views/flow/deploy/deploy.vue'], resolve); } 
			},
			{ 
				path: 'manage', 
				title: '管理流程', 
				name: 'flow_manage', 
				component: resolve => { require(['@/views/flow/manage/manage.vue'], resolve); } 
			},
			{ 
				path: 'ongoing', 
				title: '进行中流程', 
				name: 'flow_ongoing', 
				component: resolve => { require(['@/views/flow/ongoing/ongoing.vue'], resolve); } 
			}
		]
	},
	{
		path: '/access',
		icon: 'key',
		name: 'access',
		title: '权限管理',
		component: Main,
		children: [
			{ path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['@/views/access/access.vue'], resolve); } }
		]
	},
	{
		path: '/access-test',
		icon: 'lock-combination',
		title: '权限测试页',
		name: 'accesstest',
		access: 0,
		component: Main,
		children: [
			{ path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: resolve => { require(['@/views/access/access-test.vue'], resolve); } }
		]
	},
	{
		path: '/international',
		icon: 'earth',
		title: {i18n: 'international'},
		name: 'international',
		component: Main,
		children: [
			{ path: 'index', title: {i18n: 'international'}, name: 'international_index', component: resolve => { require(['@/views/international/international.vue'], resolve); } }
		]
	},
	{
		path: '/component',
		icon: 'social-buffer',
		name: 'component',
		title: '组件',
		component: Main,
		children: [
			{
				path: 'text-editor',
				icon: 'compose',
				name: 'text-editor',
				title: '富文本编辑器',
				component: resolve => { require(['@/views/my-components/text-editor/text-editor.vue'], resolve); }
			},
			{
				path: 'md-editor',
				icon: 'pound',
				name: 'md-editor',
				title: 'Markdown编辑器',
				component: resolve => { require(['@/views/my-components/markdown-editor/markdown-editor.vue'], resolve); }
			},
			{
				path: 'image-editor',
				icon: 'crop',
				name: 'image-editor',
				title: '图片预览编辑',
				component: resolve => { require(['@/views/my-components/image-editor/image-editor.vue'], resolve); }
			},
			{
				path: 'draggable-list',
				icon: 'arrow-move',
				name: 'draggable-list',
				title: '可拖拽列表',
				component: resolve => { require(['@/views/my-components/draggable-list/draggable-list.vue'], resolve); }
			},
			{
				path: 'area-linkage',
				icon: 'ios-more',
				name: 'area-linkage',
				title: '城市级联',
				component: resolve => { require(['@/views/my-components/area-linkage/area-linkage.vue'], resolve); }
			},
			{
				path: 'file-upload',
				icon: 'android-upload',
				name: 'file-upload',
				title: '文件上传',
				component: resolve => { require(['@/views/my-components/file-upload/file-upload.vue'], resolve); }
			},
			{
				path: 'count-to',
				icon: 'arrow-graph-up-right',
				name: 'count-to',
				title: '数字渐变',
				component: resolve => { require(['@/views/my-components/count-to/count-to.vue'], resolve); }
			}
			// {
			//     path: 'clipboard-page',
			//     icon: 'clipboard',
			//     name: 'clipboard-page',
			//     title: '一键复制',
			//     component: resolve => { require(['@/views/my-components/clipboard/clipboard.vue'], resolve); }
			// }
		]
	},
	{
		path: '/form',
		icon: 'android-checkbox',
		name: 'form',
		title: '表单编辑',
		component: Main,
		children: [
			{ path: 'artical-publish', title: '文章发布', name: 'artical-publish', icon: 'compose', component: resolve => { require(['@/views/form/article-publish/article-publish.vue'], resolve); } },
			{ path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: resolve => { require(['@/views/form/work-flow/work-flow.vue'], resolve); } }

		]
	},
	// {
	//     path: '/charts',
	//     icon: 'ios-analytics',
	//     name: 'charts',
	//     title: '图表',
	//     component: Main,
	//     children: [
	//         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('@/views/access/access.vue') },
	//         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('@/views/access/access.vue') }

	//     ]
	// },
	{
		path: '/tables',
		icon: 'ios-grid-view',
		name: 'tables',
		title: '表格',
		component: Main,
		children: [
			{ path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: resolve => { require(['@/views/tables/dragable-table.vue'], resolve); } },
			{ path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: resolve => { require(['@/views/tables/editable-table.vue'], resolve); } },
			{ path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: resolve => { require(['@/views/tables/searchable-table.vue'], resolve); } },
			{ path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: resolve => { require(['@/views/tables/exportable-table.vue'], resolve); } },
			{ path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: resolve => { require(['@/views/tables/table-to-image.vue'], resolve); } }
		]
	},
	{
		path: '/advanced-router',
		icon: 'ios-infinite',
		name: 'advanced-router',
		title: '高级路由',
		component: Main,
		children: [
			{ path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: resolve => { require(['@/views/advanced-router/mutative-router.vue'], resolve); } },
			{ path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: resolve => { require(['@/views/advanced-router/argument-page.vue'], resolve); } }
		]
	},
	{
		path: '/error-page',
		icon: 'android-sad',
		title: '错误页面',
		name: 'errorpage',
		component: Main,
		children: [
			{ path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['@/views/error-page/error-page.vue'], resolve); } }
		]
	}
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
	loginRouter,
	otherRouter,
	preview,
	locking,
	...appRouter,
	page500,
	page403,
	page404
];
