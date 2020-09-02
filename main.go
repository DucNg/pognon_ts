package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/DucNg/pognon_ts/data"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/:hash", func(c *gin.Context) {
		hash := c.Param("hash")

		engine, err := data.GetEngine()
		defer engine.Close()
		if err != nil {
			log.Fatal(err)
		}
		p, err := data.GetPognon(engine, hash)
		if err != nil {
			log.Fatal(err)
		}
		if p == nil {
			c.JSON(http.StatusNotFound, "No pognon for this hash")
			return
		}

		c.JSON(http.StatusOK, p)
	})

	fmt.Print("Server running on :8080")
	r.Run(":8080")
}
