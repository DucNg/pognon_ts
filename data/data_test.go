package data

import (
	"encoding/json"
	"os"
	"os/exec"
	"testing"
)

func init() {
	// Delete any existing database file before running test
	exec.Command("rm", "test.db").Run()
}

func TestDatabase(t *testing.T) {
	t.Log("Create a pognon on sql database")

	engine, err := GetEngine("./test.db")
	if err != nil {
		t.Fatal(err)
	}
	defer engine.Close()

	// Create a some persons
	persons := []Person{{Name: "a"}, {Name: "b"}, {Name: "c"}, {Name: "d"}}
	_, err = engine.Insert(persons)
	if err != nil {
		t.Fatal(err)
	}

	// Create a pognon with a unique hash
	p := Pognon{IDPognon: 1, PognonHash: "abcdefgh"}
	_, err = engine.Insert(p)
	if err != nil {
		t.Fatal(err)
	}

	// Link pognon and persons
	participants := []Participants{{1, 1}, {1, 2}, {1, 3}, {1, 4}}
	_, err = engine.Insert(participants)
	if err != nil {
		t.Fatal(err)
	}
	t.Log("Wrote pognon to database")

	t1 := Transaction{
		PognonHash: "abcdefgh",
		Buyers:     []Purchase{{1, 10.25}},
		For:        []Purchase{{1, 5}, {2, 3}, {3, 2.25}},
		Reason:     "love",
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
		PognonHash: "abcdefgh",
		Buyers:     []Purchase{{1, 5.4}},
		For:        []Purchase{{1, 1.8}, {2, 1.8}, {3, 1.8}},
		Reason:     "bus",
	}
	_, err = engine.Insert(t2)
	if err != nil {
		t.Fatal(err)
	}
	t.Log("Wrote transaction to database")

}

// func TestMongo(t *testing.T) {
// 	t.Log("Create a pognon on mongo database")
// 	session, err := mgo.Dial("localhost")
// 	if err != nil {
// 		t.Fatal(err)
// 	}
// 	defer session.Close()

// 	// Create the pognon with a pognon collection
// 	c := session.DB("pognon").C("pognon")

// 	p := Pognon{IDPognon: 1, Participants: []string{&persons[0], &persons[1], &persons[2], "d"}, PognonHash: "abcdefgh"}
// 	if err != nil {
// 		t.Fatal(err)
// 	}
// 	t.Log("Wrote pognon to database")
// 	err = c.Insert(&p)
// 	if err != nil {
// 		t.Fatal(err)
// 	}

// 	c = session.DB("pognon").C("transaction")
// 	t1 := Transaction{
// 		PognonHash: "abcdefgh",
// 		Buyers:     []Purchase{{&persons[0], 10.25}},
// 		For:        []Purchase{{&persons[0], 5}, {&persons[2], 3}, {&persons[0], 2.25}},
// 		Reason:     "love",
// 	}
// 	err = c.Insert(&t1)
// 	if err != nil {
// 		t.Fatal(err)
// 	}
// 	var value = Transaction{}
// 	err = c.Find(bson.M{"idtransaction": 0}).One(&value)
// 	if err != nil {
// 		t.Fatal(err)
// 	}
// 	json, _ := json.MarshalIndent(&value, "", "\t")
// 	os.Stdout.Write(json)
// }
