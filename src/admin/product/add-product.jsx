import React,{useState,useRef} from 'react';
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
// import {Skeleton} from '@material-ui/lab';
import {
    AddBox as AddProductIcon,
    AddPhotoAlternateOutlined as AddProductImageIcon,
} from '@material-ui/icons';

export function AddProduct() {
    const classes = useStyles();
    const addProductClasses = useAddProductStyle();
    const productNameProps = useFormValue('');
    const productPrizeProps = useFormValue(0);
    const productDiscountProps = useFormValue(0);
    const productQuantityProps = useFormValue(0);
    const productDescriptionProps = useFormValue('');
    const [productsImages,setProductsImages] = useState({images:[]});
    const addNewProduct = useRef(null)
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
        if(isValidate){
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify({ 
                    productName:  productNameProps.value,
                    productPrize:  Number(productPrizeProps.value),
                    productQuantity:  Number(productQuantityProps.value),
                    productDiscount:  Number(productDiscountProps.value),
                    productDescription:  productDescriptionProps.value,
                    productImage:  productsImages.images,
                })
            };
            
            fetch('http://localhost:8000/admin/add-product', requestOptions)
                .then((response) => {
                    const data = response.json()
                    return data   
                })
                .then((data) => {
                    console.log(data);
                    
                });
        }
        e.preventDefault();
    }

    console.log(productNameProps)
    return (
      <div className={classes.root}>
          <Header />
          <Sidebar isProduct={true} />
          <main className={classes.content}>
              <Toolbar />
              <Container maxWidth="lg">
                  <Grid container>
                      <Grid item xs={12}>
                          <Paper className={classes.innerHeader}>
                              <Typography component="h2" variant="h6" color="primary" gutterBottom>Add Product</Typography>
                          </Paper>
                      </Grid>
                      <Grid item xs={12}>
                          <Paper className={addProductClasses.paperBoxAddProduct}>
                            <form ref={addNewProduct} className={classes.root} noValidate autoComplete="off" onSubmit={(e) => submitNewProductDetail(e)}>
                                <Grid container>
                                    <Grid item xs={12} className={addProductClasses.fullWidthGrid}>
                                        <TextField className={addProductClasses.fullWidth} id="outlined-basic" label="Product Name" variant="outlined" name="product_name" {...productNameProps} />
                                    </Grid>
                                    <Grid item xs={4} className={addProductClasses.fullWidthGrid}>
                                        <TextField  className={addProductClasses.fullWidth} id="outlined-basic" label="Prize" variant="outlined" type="number" name="product_prize" {...productPrizeProps}InputProps={{
                                            startAdornment: <InputAdornment position="start">{CURRENCY_SYMBOL}</InputAdornment>,
                                            inputProps: { min: 0 },
                                            }} />
                                    </Grid>
                                    <Grid item xs={4} className={addProductClasses.fullWidthGrid}>
                                        <TextField className={addProductClasses.fullWidth} id="outlined-basic" label="Discount" variant="outlined" type="number" name="product_discount" {...productDiscountProps} InputProps={{
                                            inputProps: { min: 0,max:100 },
                                            }} />
                                    </Grid>
                                    <Grid item xs={4} className={addProductClasses.fullWidthGrid}>
                                        <TextField className={addProductClasses.fullWidth} id="outlined-basic" label="Quantity" variant="outlined" type="number" name="product_quantity" {...productQuantityProps} InputProps={{
                                            inputProps: { min: 0 },
                                            }} />
                                    </Grid>
                                    <Grid item xs={12} className={addProductClasses.fullWidthGrid}>
                                        <TextField className={addProductClasses.fullWidth} id="outlined-basic" label="Description" variant="outlined" multiline rows={2} name="product_desc" {...productDescriptionProps} />
                                    </Grid>
                                    <Grid item xs={12} className={clsx(addProductClasses.fullWidthGrid,addProductClasses.productImagesBox)}>
                                        <Grid item xs={12}>
                                            <Typography display="block" gutterBottom variant="subtitle1">Product Images</Typography>
                                        </Grid>
                                        {productsImages.images.map(imageProps => (
                                        <Grid item xs={4} key={imageProps.id} className={addProductClasses.fullWidthGrid}>
                                            <Paper className={classes.productInfoImgBox}>
                                                <img className={addProductClasses.productInfoImg} alt="Logo" src={"data:image/jpeg;base64,"+imageProps.base64String}/>
                                            </Paper>
                                        </Grid>
                                        ))}
                                        <Grid item xs={4} className={addProductClasses.fullWidthGrid} >
                                            <Button
                                                variant="contained"
                                                component="label"
                                                className={addProductClasses.addProductImgBox}
                                                onChange={(e) => addProductImage(e)}
                                                
                                            >
                                                <input accept="image/*" type="file" hidden multiple />
                                                <AddProductImageIcon className={addProductClasses.addProductImageIcon}/>
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={6} className={addProductClasses.fullWidthGrid}>
                                        <Button type="submit" size="medium" variant="contained" color="primary" startIcon={<AddProductIcon />}>Add</Button>
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

export function useFormValue(initialValue){
    const [value , setValue] = useState(initialValue); 
    const [isValid , setIsValid] = useState(true); 

    function handleSetValues(e){
        const inputFieldValue = e.target.value;
        const inputFieldName = e.target.name;

        switch(inputFieldName){
            case "product_prize":
                if( inputFieldValue < 0){
                    return
                }
                break;
            case "product_discount":
                if( inputFieldValue < 0 || inputFieldValue > 100){
                    return
                }
                break;
            case "product_quantity":
                if( inputFieldValue < 0){
                    return
                }
                break;
            default: 
        }
        setValue(inputFieldValue);
        setIsValid(!inputFieldValue?false:true);
    }

    function handleCheckValues(e){
        const inputFieldName = e.target.name;
        const inputFieldValue = e.target.value;
        
        switch(inputFieldName){
            case "product_name": 
                setIsValid(!inputFieldValue?false:true);
                break;
            case "product_prize":
                setIsValid(!inputFieldValue?false:true);
                break;
            case "product_discount":
                setIsValid(!inputFieldValue?false:true);
                break;
            case "product_quantity":
                setIsValid(!inputFieldValue?false:true);
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

    return {
        value:value,
        error:!isValid,
        onChange:handleSetValues,
        onBlur:handleCheckValues,
        onKeyPress:handleCheckChar,
    };
}   