const getters = {
    projectName: (state) => state.app.projectName,
    sidebar: (state) => state.app.sidebar,
    device: (state) => state.app.device,
    size: (state) => state.app.size,
    language: (state) => state.app.language,
    avatar: (state) => state.user.avatar,
    visitedViews: (state) => state.tagsView.visitedViews,
    token: (state) => state.user.token
};
export default getters;
