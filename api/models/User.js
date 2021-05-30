class User { 
    constructor(id, name, photoUrl, lastUpdated, isDeleted) { 
        this.id = id
        this.name = name;
        this.photoUrl = photoUrl;
        this.lastUpdated = lastUpdated;
        this.isDeleted = isDeleted;
    }

    getObject() {
        return {
            name: this.name,
            photoUrl: this.photoUrl,
            lastUpdated: this.lastUpdated,
            isDeleted: this.isDeleted
        }   
    }
}

module.exports = User;