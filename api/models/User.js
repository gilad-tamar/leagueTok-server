class User { 
    constructor(id, name, lastUpdated, isDeleted) { 
        this.id = id
        this.name = name;
        this.lastUpdated = lastUpdated;
        this.isDeleted = isDeleted;
    }

    getObject() {
        return {
            name: this.name,
            lastUpdated: this.lastUpdated,
            isDeleted: this.isDeleted
        }   
    }
}

module.exports = User;