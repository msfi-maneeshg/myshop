import React,{useState,useRef, useEffect} from 'react';
import {useParams} from 'react-router-dom'
import {useStyles,useAddProductStyle} from '../common'
import {Header} from '../header'
import {Sidebar} from '../sidebar'
import {CURRENCY_SYMBOL} from '../../constant'
import clsx from 'clsx';
import {
    Container,
    Grid,
    Paper,
    Toolbar,
    Typography,
    TextField,
    Button,
    InputAdornment,
} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {
    AddBox as AddProductIcon,
    AddPhotoAlternateOutlined as AddProductImageIcon,
    Save as UpdateProductDetailIcon,
} from '@material-ui/icons';

export function AddProductDetails() {
    const classes = useStyles();
    const addProductClasses = useAddProductStyle();
    const [productsImages,setProductsImages] = useState({images:[]});
    const addNewProduct = useRef(null)
    let {productID}  = useParams();
    const [productNameProps,setProductNameProps] = useState({value:'',error:false});
    const [productPrizeProps,setProductPrizeProps] = useState({value:0,error:false});
    const [productDiscountProps,setProductDiscountProps] = useState({value:0,error:false});
    const [productQuantityProps,setProductQuantityProps] = useState({value:0,error:false});
    const [productDescriptionProps,setProductDescriptionProps] = useState({value:'',error:false});
    const [productImagesProps,setProductImagesProps] = useState({images:[]});
    const [alertBoxProps,setAlertBoxProps] = useState({isShow:false,severity:"info",message:""});
    const [isDataLoaded,setIsDataLoaded] = useState(false);
    useEffect(() => {
        if(!isDataLoaded && productID){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            fetch('http://localhost:8000/admin/product-detail/'+productID, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                if(isStatusOK){
                    let productDetails = data.content;
                    setProductNameProps({value:productDetails.productName,error:false});
                    setProductPrizeProps({value:productDetails.productPrize,error:false});
                    setProductDiscountProps({value:parseFloat(productDetails.productDiscount),error:false});
                    setProductQuantityProps({value:productDetails.productQuantity,error:false});
                    setProductDescriptionProps({value:productDetails.productDescription,error:false});
                    setProductImagesProps({images:productDetails.productImage})
                }else{

                }
                setIsDataLoaded(true)
            }); 
        }
    })

    function handleSetValues(e){
        const inputFieldValue = e.target.value;
        const inputFieldName = e.target.name;
        let isValid = inputFieldValue?false:true;
        switch(inputFieldName){
            case "product_name":
                setProductNameProps({value:inputFieldValue,error:isValid})
                break;
            case "product_prize":
                if( inputFieldValue >= 0){
                    setProductPrizeProps({value:inputFieldValue,error:isValid})
                }
                break;
            case "product_discount":
                if( inputFieldValue >= 0 && inputFieldValue <= 100){
                    setProductDiscountProps({value:inputFieldValue,error:isValid})
                }
                break;
            case "product_quantity":
                if( inputFieldValue >= 0){
                    setProductQuantityProps({value:inputFieldValue,error:isValid})
                }
                break;
            case "product_desc":
                setProductDescriptionProps({value:inputFieldValue,error:isValid})
                break;
            default: 
        }
    }

    function handleCheckChar(e){
        const numberPattern = new RegExp(/^\d*$/);
        const inputFieldName = e.target.name;
        // const inputFieldValue = e.target.value;
    
        switch(inputFieldName){
            case "product_prize":
                if(!numberPattern.test(e.key)){
                    e.preventDefault();
                }
                break;
            case "product_discount":
                if(!numberPattern.test(e.key)){
                    e.preventDefault();
                }
                break;
            case "product_quantity":
                if(!numberPattern.test(e.key)){
                    e.preventDefault();
                }
                break;
            default: 
        }
        
    }
    
    const addProductImage = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            const profileReader = new FileReader();
            profileReader.onload = _handleReaderLoaded
            profileReader.readAsBinaryString(e.target.files[i])
        }
        return;
    }

    const _handleReaderLoaded = (readerEvt) => {
        let binaryString = readerEvt.target.result;
        let productsImagesTemp = productsImages.images
        console.log(readerEvt.target.name);
        let imageID = productsImagesTemp.lenght + 1;
        let  productImageProps = {
            id:imageID,
            name:""+imageID,
            base64String:btoa(binaryString),
        };

        productsImagesTemp.push(productImageProps)
        setProductsImages({images:productsImagesTemp});
    }

    const submitNewProductDetail = (e) => {
        let isValidate = true;
        if(!productNameProps.value){
            setProductNameProps({value:productNameProps.value,error:true});
            isValidate = false;
        }

        if(!productPrizeProps.value){
            setProductPrizeProps({value:productPrizeProps.value,error:true});
            isValidate = false;
        }

        if(productDiscountProps.value === ""){
            setProductDiscountProps({value:productDiscountProps.value,error:true});
            isValidate = false;
        }

        if(!productQuantityProps.value){
            setProductQuantityProps({value:productQuantityProps.value,error:true});
            isValidate = false;
        }

        if(!productDescriptionProps.value){
            setProductDescriptionProps({value:productDescriptionProps.value,error:true});
            isValidate = false;
        }

        if(isValidate){
            let isStatusOK = false;
            let apiEndPoint = 'http://localhost:8000/admin/add-product';
            let methodType = 'POST';
            if(productID){
                apiEndPoint = 'http://localhost:8000/admin/product-detail/'+productID;
                methodType = 'UPDATE';
            }

            const requestOptions = {
                method: methodType,
                body: JSON.stringify({ 
                    productName:  productNameProps.value,
                    productPrize:  Number(productPrizeProps.value),
                    productQuantity:  Number(productQuantityProps.value),
                    productDiscount:  Number(productDiscountProps.value),
                    productDescription:  productDescriptionProps.value,
                    productImage:  productsImages.images,
                })
            };
            fetch(apiEndPoint, requestOptions)
                .then((response) => {
                    const data = response.json();
                    isStatusOK = response.status === 200 ?true:false;
                    return data   ;
                })
                .then((data) => {
                    let tmpValues = alertBoxProps;
                    tmpValues.isShow = true;
                    tmpValues.message = data.content;                
                    tmpValues.severity =  isStatusOK?"success":"error";
                    setAlertBoxProps({...tmpValues});
                    if(!productID && isStatusOK){
                        //-------reset the form when new product is added
                        setProductNameProps({value:'',error:false});
                        setProductPrizeProps({value:0,error:false});
                        setProductDiscountProps({value:0,error:false});
                        setProductQuantityProps({value:0,error:false});
                        setProductDescriptionProps({value:'',error:false});
                        setProductImagesProps({images:[]})
                        setProductsImages({images:[]})
                    }
                });
        }
        
        e.preventDefault();
    }

    const handleCloseAlert = (e) => {
        let tmpValues = alertBoxProps;
        tmpValues.isShow = false;
        setAlertBoxProps({...tmpValues});
    }
    return (
      <div className={classes.root}>
          <Header />
          <Sidebar {...{menu:'product',subMenu:"product:add"}} />
          <main className={classes.content}>
              <Toolbar />
              <Container maxWidth="lg">
                  <Grid container>
                      <Grid item xs={12}>
                          <Paper className={classes.innerHeader}>
                              <Typography component="h2" variant="h6" color="primary" gutterBottom>{productID?"Edit Product Details":"Add Product"}</Typography>
                          </Paper>
                      </Grid>
                      <Grid item xs={12}>
                          <Paper className={addProductClasses.paperBoxAddProduct}>
                          {alertBoxProps.isShow?<Alert severity={alertBoxProps.severity} onClose={(e) => handleCloseAlert(e)}>{alertBoxProps.message}</Alert>:""}
                            <form ref={addNewProduct} className={classes.root} noValidate autoComplete="off" onSubmit={(e) => submitNewProductDetail(e)}>
                                <Grid container>
                                    <Grid item xs={12} className={addProductClasses.fullWidthGrid}>
                                        <TextField className={addProductClasses.fullWidth} id="outlined-basic" label="Product Name" variant="outlined" name="product_name" {...productNameProps} onChange={(e) => handleSetValues(e)} onBlur={(e) => handleSetValues(e)} />
                                    </Grid>
                                    <Grid item xs={4} className={addProductClasses.fullWidthGrid}>
                                        <TextField  className={addProductClasses.fullWidth} id="outlined-basic" label="Prize" variant="outlined" type="number" name="product_prize" {...productPrizeProps} onChange={(e) => handleSetValues(e)} onBlur={(e) => handleSetValues(e)} onKeyPress={(e) => handleCheckChar(e)} InputProps={{
                                            startAdornment: <InputAdornment position="start">{CURRENCY_SYMBOL}</InputAdornment>,
                                            inputProps: { min: 0 },
                                            }} />
                                    </Grid>
                                    <Grid item xs={4} className={addProductClasses.fullWidthGrid}>
                                        <TextField className={addProductClasses.fullWidth} id="outlined-basic" label="Discount" variant="outlined" type="number" name="product_discount" {...productDiscountProps} onChange={(e) => handleSetValues(e)} onBlur={(e) => handleSetValues(e)} onKeyPress={(e) => handleCheckChar(e)} InputProps={{
                                            inputProps: { min: 0,max:100 },
                                            }} />
                                    </Grid>
                                    <Grid item xs={4} className={addProductClasses.fullWidthGrid}>
                                        <TextField className={addProductClasses.fullWidth} id="outlined-basic" label="Quantity" variant="outlined" type="number" name="product_quantity" {...productQuantityProps} onChange={(e) => handleSetValues(e)} onBlur={(e) => handleSetValues(e)} onKeyPress={(e) => handleCheckChar(e)} InputProps={{
                                            inputProps: { min: 0 },
                                            }} />
                                    </Grid>
                                    <Grid item xs={12} className={addProductClasses.fullWidthGrid}>
                                        <TextField className={addProductClasses.fullWidth} id="outlined-basic" label="Description" variant="outlined" multiline rows={3} name="product_desc" onChange={(e) => handleSetValues(e)} onBlur={(e) => handleSetValues(e)} {...productDescriptionProps} />
                                    </Grid>
                                    <Grid item xs={12} className={clsx(addProductClasses.fullWidthGrid,addProductClasses.productImagesBox)}>
                                        <Grid item xs={12}>
                                            <Typography display="block" gutterBottom variant="subtitle1">Product Images</Typography>
                                        </Grid>
                                        <Grid item xs={12}  className={clsx(addProductClasses.fullWidthGrid,addProductClasses.productImageBox)}>
                                            {productImagesProps.images && productImagesProps.images.map((imageProps,index) => (
                                                <Paper className={addProductClasses.productInfoImgBox} key={index}>
                                                    <img className={addProductClasses.productInfoImg} alt="Logo" src={"http://localhost:8000/image/"+imageProps.imageName}/>
                                                </Paper>
                                        
                                            ))}
                                            {productsImages.images && productsImages.images.map((imageProps,index) => (
                                                <Paper className={addProductClasses.productInfoImgBox} key={index}>
                                                    <img className={addProductClasses.productInfoImg} alt="Logo" src={"data:image/jpeg;base64,"+imageProps.base64String}/>
                                                </Paper>
                                        
                                            ))}
                                            <Paper className={addProductClasses.productInfoImgBox} >
                                            <Button
                                                variant="contained"
                                                component="label"
                                                className={addProductClasses.addProductImgBox}
                                                onChange={(e) => addProductImage(e)}
                                                
                                            >
                                                <input accept="image/*" type="file" hidden multiple />
                                                <AddProductImageIcon className={addProductClasses.addProductImageIcon}/>
                                            </Button></Paper>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={6} className={addProductClasses.fullWidthGrid}>
                                        <Button type="submit" size="medium" variant="contained" color="primary" startIcon={productID?<UpdateProductDetailIcon />:<AddProductIcon/>}>{productID?"Update":"Add"}</Button>
                                    </Grid>
                                </Grid>
                            </form>
                          </Paper>
                      </Grid>
                  </Grid>
              </Container>
          </main>
      </div>
    );
} 