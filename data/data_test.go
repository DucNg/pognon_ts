package data

import (
	"encoding/json"
	"os"
	"os/exec"
	"testing"

	"github.com/go-xorm/xorm"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func init() {
	exec.Command("rm", "test.db").Run()
}

func TestDatabase(t *testing.T) {
	t.Log("Create a pognon on sql database")

	engine, err := xorm.NewEngine("sqlite3", "./test.db")
	if err != nil {
		t.Fatal(err)
	}
	defer engine.Close()

	err = engine.Sync2(new(Transaction), new(Pognon))
	if err != nil {
		t.Fatal(err)
	}

	p := Pognon{IDPognon: 1, Participants: []string{"a", "b", "c", "d"}, PognonHash: "abcdefgh"}
	_, err = engine.Insert(p)
	if err != nil {
		t.Fatal(err)
	}
	t.Log("Wrote pognon to database")

	t1 := Transaction{
		Pognon: &p,
		Buyers: []Purchase{{"a", 10.25}},
		For:    []Purchase{{"a", 5}, {"c", 3}, {"a", 2.25}},
		Reason: "love",
	}
	_, err = engine.Insert(t1)
	if err != nil {
		t.Fatal(err)
	}
	t.Log("Wrote transaction to database")
	t.Log("Getting value back")
	var value = Transaction{IDTransaction: 1}
	_, err = engine.Get(&value)
	if err != nil {
		t.Fatal(err)
	}
	json, _ := json.MarshalIndent(&value, "", "\t")
	os.Stdout.Write(json)

	t2 := Transaction{
		Pognon: &p,
		Buyers: []Purchase{{"a", 5.4}},
		For:    []Purchase{{Person: "a"}, {Person: "b"}, {Person: "c"}},
		Reason: "bus",
	}
	_, err = engine.Insert(t2)
	if err != nil {
		t.Fatal(err)
	}
	t.Log("Wrote transaction to database")

}

func TestMongo(t *testing.T) {
	t.Log("Create a pognon on mongo database")
	session, err := mgo.Dial("localhost")
	if err != nil {
		t.Fatal(err)
	}
	defer session.Close()

	// Create the pognon with a pognon collection
	c := session.DB("pognon").C("pognon")

	p := Pognon{IDPognon: 1, Participants: []string{"a", "b", "c", "d"}, PognonHash: "abcdefgh"}
	if err != nil {
		t.Fatal(err)
	}
	t.Log("Wrote pognon to database")
	err = c.Insert(&p)
	if err != nil {
		t.Fatal(err)
	}

	c = session.DB("pognon").C("transaction")
	t1 := Transaction{
		Pognon: &p,
		Buyers: []Purchase{{"a", 10.25}},
		For:    []Purchase{{"a", 5}, {"c", 3}, {"a", 2.25}},
		Reason: "love",
	}
	err = c.Insert(&t1)
	if err != nil {
		t.Fatal(err)
	}
	var value = Transaction{}
	err = c.Find(bson.M{"idtransaction": 0}).One(&value)
	if err != nil {
		t.Fatal(err)
	}
	json, _ := json.MarshalIndent(&value, "", "\t")
	os.Stdout.Write(json)
}
