class OriginalVideo { 
    constructor(id, name, uri, performer, uploadDate, lastUpdated, isDeleted) { 
        this.id = id
        this.name = name;
        this.uri  = uri;
        this.performer  = performer;
        this.uploadDate  = uploadDate;
        this.lastUpdated = lastUpdated;
        this.isDeleted = isDeleted;
    }

    getObject() {
        return {
            name: this.name,
            uri: this.uri,
            performer: this.performer,
            uploadDate: this.uploadDate,
            lastUpdated: this.lastUpdated,
            isDeleted: this.isDeleted
        }   
    }
}

module.exports = OriginalVideo;