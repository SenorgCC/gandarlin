export class Spieler{
    name:string;
    leben:number;
    constructor(n:string,l:number){
        this.name=n;
        this.leben=l;
    }
    grues(){
        return "Hallo, ich bin "+this.name;
    }
}
