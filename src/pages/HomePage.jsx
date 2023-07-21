import React, { useEffect, useState } from "react";
import DateFn from "../components/DateFn";
import axios from "axios";


const HomePage = () => {
  const [batch_number, setBatch_number] = useState([]);
  const [qty, setQty] = useState([]);
  const [selectValue, setSelectValue] = useState([]);
  const [selectArray, setSelectArray] = useState([]);
  const [rowIds, setRowIds] = useState([]);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const makeTokenRequest = async () => {
      try {
        const response = await axios.post(
          "https://eaf-dms-api.yecor.com/api/auth/login",
          {
            email: "yagnikoo@yopmail.com",
            password: "Moweb@123",
            device_id: "sDUhIoUzN41Is4iM1r0BcsDP4exWLpInVxuT50Ft",
            device_token:
              "cyKtfAZpI9GBrLUfz8SgWV:APA91bEECZrhEE80WnlJmEOiX6_EJ-JtDF9IV5eW96wgj-ghSJ7c3K5ZG9Psh8CMyYWcoDxDcfU805SDRpBdoJompANG3YTp0aeR4wlT5tiWZdmK-3KPq7kECF8raRLRfh0qW3TN1SnA",
            device_type: "web",
          }
        );

        if (response.status === 200) {
          const token = response.data.token;

          // Store the token in local storage
          localStorage.setItem("token", token);

          console.log("Login successful!");
        } else {
          console.log("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("An error occurred while logging in:", error);
      }
    };

    makeTokenRequest();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://eaf-dms-api.yecor.com/api/inventory/product-SKUs/?warehouse_id=22&ordering=name&search=&limit=10&offset=&remove_product_stocking=true",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setSelectArray(response.data.results);
        } else {
          console.log("Failed to fetch data.");
        }
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddRow = () => {
    setBatch_number((prevBatchNumbers) => [...prevBatchNumbers, ""]);
    setQty((prevInwardQuantities) => [...prevInwardQuantities, ""]);
    // Generate a new ID for the row
    const Id = rowIds.length + 1;
    setRowIds((prevRowIds) => [...prevRowIds, Id]);
  };

  const handleDeleteRow = (index) => {
    setBatch_number((prev) => {
      const newBatchNumbers = [...prev];
      newBatchNumbers.splice(index, 1);
      return newBatchNumbers;
    });
    setQty((prev) => {
      const newInwardQuantities = [...prev];
      newInwardQuantities.splice(index, 1);
      return newInwardQuantities;
    });
    setRowIds((prevRowIds) => {
      const newRowIds = [...prevRowIds];
      newRowIds.splice(index, 1);
      return newRowIds;
    });
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "#") {
      e.preventDefault();
    } else if (e.key !== "Backspace") {
      setBatch_number((prevValue) => {
        const newBatchNumbers = [...prevValue];
        newBatchNumbers[index] = newBatchNumbers[index].startsWith("#")
          ? newBatchNumbers[index] + e.key
          : `#${e.key}`;
        return newBatchNumbers;
      });
    }
  };

  const handleBatchNumberChange = (event, index) => {
    const { value } = event.target;
    setBatch_number((prevValue) => {
      const newBatchNumbers = [...prevValue];
      newBatchNumbers[index] = value;
      return newBatchNumbers;
    });
  };

  const handleInwardQuantityChange = (event, index) => {
    const { value } = event.target;
    setQty((prevQty) => {
      const newInwardQuantities = [...prevQty];
      newInwardQuantities[index] = value;
      return newInwardQuantities;
    });
  };
  const handelSelectChange = (event, index) => {
    const { value } = event.target;
    setSelectValue((prevValue) => {
      const newInputValueArray = [...prevValue];
      newInputValueArray[index] = value;
      return newInputValueArray;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!batch_number.length || !qty.length || !selectValue.length) {
      setError("Please fill in all the fields.");
      return;
    } else {
      console.log("ID:", rowIds);
      console.log("batch-number:", batch_number);
      console.log("name:", selectValue);
      console.log("qty:", qty);

      const stockEntries = batch_number.map((batch_number, index) => ({
        product_id: rowIds[index],
        batch_number: batch_number,
        expiry_date: "2023-07-17",
        qty: qty[index],
      }));

      const payload = {
        stock_entries: stockEntries,
        stock_type: "FreshProduct",
        stock_entry_type: "In",
        receiver_warehouse_id: "62",
      };

      try {
        const response = await axios.post(
          "https://eaf-dms-api.yecor.com/api/inventory/bulk_stock_in_out/",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Stock-in successful!");
          const newIds = response.data.stock_entries.map((entry) => entry.id);
          setRowIds(newIds);
          setBatch_number([]);
          setQty([]);
          setSelectValue([]);
        }
      } catch (error) {
        console.error("An error occurred while performing stock-in:", error);
      }
    }
  };

  return (
    <>
      <div className="container mt-5">
        <h1 className="mt-2 mb-4">Welocme to Home page</h1>
        <hr />
        <h4>Fresh Stock-in</h4>

        <div className="row">
          <div className="col">
            <label htmlFor="">Product SKU</label>
          </div>
          <div className="col">
            <label htmlFor="Batch no">Batch Number</label>
          </div>
          <div className="col">
            <label htmlFor="date">Expiry Date</label>
          </div>
          <div className="col">
            <label htmlFor="Batch no">Inward Qty</label>
          </div>
          <div className="col">Delete</div>
        </div>

        <form action="" onSubmit={handleSubmit}>
          {batch_number.map((batch_number, index) => (
            <div className="row mt-3" key={index}>
              <div className="col">
                <select
                  name=""
                  id=""
                  value={selectValue[index]}
                  onChange={(e) => handelSelectChange(e, index)}
                >
                  <option value="select">select</option>
                  {selectArray &&
                    selectArray.map((item, index) => (
                      <>
                        <option value={item.name} key={index}>
                          {item.name}
                        </option>
                      </>
                    ))}
                </select>
              </div>
              <div className="col">
                <input
                  type="text"
                  placeholder="Type here..."
                  value={batch_number}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onChange={(e) => handleBatchNumberChange(e, index)}
                />
              </div>
              <div className="col">
              <DateFn/>
              </div>
              <div className="col">
                <input
                  type="text"
                  placeholder="Type here..."
                  value={qty[index]}
                  onChange={(e) => handleInwardQuantityChange(e, index)}
                />
              </div>
              <div className="col">
                <button
                  onClick={() => handleDeleteRow(index)}
                  className="btn btn-info"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
          {error && <h6 className="text-danger">{error}</h6>}

          
          <center>
            <button className="btn btn-secondary">Cancel</button>{" "}
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </center>
        </form>
        <button onClick={handleAddRow} className="btn btn-info">
            ➕
          </button>
      </div>
    </>
  );
};

export default HomePage;