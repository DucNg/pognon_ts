package data

import (
	"os/exec"
	"testing"
)

func init() {
	// Delete any existing database file before running test
	exec.Command("rm", "test2.db").Run()
}

func TestDeletePerson(t *testing.T) {
	t.Log("Creating a new pognon")

	var pognon = Pognon{IDPognon: 1, PognonHash: "abcdefgh"}
	var participants = []Person{{IDPerson: 1, Name: "toma", PognonHash: "abcdefgh"},
		{IDPerson: 2, Name: "coucou", PognonHash: "abcdefgh"}}
	var transaction = Transaction{
		PognonHash: "abcdefgh",
		Buyers:     []Purchase{{1, 10.25, false}},
		For:        []Purchase{{1, 0, true}},
		Reason:     "love",
	}

	var pognonJSON = PognonJSON{
		&pognon,
		&participants,
		nil,
	}

	engine, err := GetEngine("test2.db")
	if err != nil {
		t.Fatal(err)
	}
	engine.ShowSQL(true)

	err = WritePognon(engine, &pognonJSON)
	if err != nil {
		t.Fatal(err)
	}

	t.Log("Succesfully created pognon")

	t.Log("Add a transaction")
	err = WriteTransaction(engine, &transaction)
	if err != nil {
		t.Fatal(err)
	}
	dbTransactions, err := GetTransactions(engine, "abcdefgh")
	if len(*dbTransactions) < 1 {
		t.Fatal("Failed to add a transaction")
	}
	t.Log("Sucessfully added a transaction")

	dbParticipants, err := GetParticipants(engine, "abcdefgh")
	if err != nil {
		t.Fatal(err)
	}
	t.Log("IDPerson 1 current name: ", (*dbParticipants)[0].Name)
	t.Log("Changing IDPerson 1 name...")
	PutPerson(engine, &Person{IDPerson: 1, Name: "jean"})
	dbParticipants, err = GetParticipants(engine, "abcdefgh")
	if err != nil {
		t.Fatal(err)
	}
	t.Log("IDPerson 1 name is now: ", (*dbParticipants)[0].Name)

	t.Log("Testing update...")
	transaction = Transaction{
		PognonHash:    "abcdefgh",
		IDTransaction: 1,
		Buyers:        []Purchase{{1, 10.25, false}},
		For:           []Purchase{{1, 0, true}, {2, 0, true}},
		Reason:        "love",
	}
	PutTransaction(engine, &transaction)
	dbTransactions, err = GetTransactions(engine, "abcdefgh")
	if err != nil {
		t.Fatal(err)
	}
	t.Log(dbTransactions)
	if len((*dbTransactions)[0].For) < 2 {
		t.Fatal("Update failed")
	}
	t.Log("Sucessfully updated transactions")

	t.Log("Trying to delete IDPerson 1")
	err = DeletePerson(engine, 1)
	if err != nil {
		t.Fatal(err)
	}
	dbParticipants, err = GetParticipants(engine, "abcdefgh")
	if len(*dbParticipants) > 1 {
		t.Fatal("Delete didn't work")
	}
	t.Log("Sucessfully deleted IDPerson 1")

}
