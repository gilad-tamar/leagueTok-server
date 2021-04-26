class ImitationVideo { 
    constructor(id, url, uid, sourceId, score, uploadDate, lastUpdated, isDeleted) { 
        this.id = id
        this.url  = url;
        this.uid  = uid;
        this.sourceId = sourceId;
        this.score = score;
        this.uploadDate  = uploadDate;
        this.lastUpdated = lastUpdated;
        this.isDeleted = isDeleted;
    }

    getObject() {
        return {
            url: this.url,
            uid: this.uid,
            sourceId: this.sourceId,
            score: this.score,
            uploadDate: this.uploadDate,
            lastUpdated: this.lastUpdated,
            isDeleted: this.isDeleted
        }   
    }
}

module.exports = ImitationVideo;