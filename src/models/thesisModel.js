export const thesisModel = (title, fileUrl, studentId, panelIds = [], adviser, currRoute) => ({
    title,
    fileUrl,
    studentId,
    panelIds,
    adviser,
    currRoute,
    createdAt: new Date(),
});
