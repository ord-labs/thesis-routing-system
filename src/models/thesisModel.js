export const thesisModel = (title, fileUrl, studentId, panelIds, adviserId, currRoute) => ({
    title,
    fileUrl,
    studentId,
    panelIds,
    adviserId,
    currRoute,
    // deadline,
    createdAt: new Date()
});