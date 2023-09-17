/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import {WebView} from 'react-native-webview';
import {StatusBar} from 'expo-status-bar';
import {Ionicons, MaterialIcons, Entypo} from '@expo/vector-icons';

import InputField from '../components/InputField';
import Spacer from '../components/Spacer';
import {BASE_URL} from '../../config';

import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheetLicense from '../components/BottomSheetLicense';
import {useTranslation} from 'react-i18next'

const LoginScreen = () => {
  Ionicons.loadFont();
  MaterialIcons.loadFont();
  const ref = useRef(null);

  const [show, setShow] = React.useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountDown] = useState(200);
  const [emailError, setEmailError] = useState('');
  const [loginFail, setLoginFail] = useState(false);
  const {login, Error, setError, isLoading, err_message} = useContext(AuthContext);
  const [loadData, setLoadData] = useState(false);
  const [loadOtp, setLoadOtp] = useState(false);
  const sent_at = new Date();
  const [isSelected, setSelection] = useState(true);
  const [showLi, setShowLi] = useState(false);
  const dimensions = useWindowDimensions();
  const {t} = useTranslation()

  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(-200);
    }
  }, []);

  const strongRegex = new RegExp(
    '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
  );

  const emailValidator = () => {
    setLoginFail(false);
    if (email == '') {
      setEmailError(t("invalid_email"));
    } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      setEmailError(t("invalid_email"));
    } else {
      setEmailError('');
    }
  };
  const onChangeOtp = e => {
    const {name, type, text} = e.nativeEvent;
    if (text.length == 4) {
      Keyboard.dismiss();
    }
  };

  const handleOtp = async () => {
    if (email == '') {
      setEmailError(t("invalid_email"));
      return false;
    }
    if (!strongRegex.test(email)) {
      setEmailError(t("invalid_email"));
      return false;
    }
    try {
      setLoadOtp(true);
      const res = await axios.post(
        "http://api.givegarden.info/api/send-otp-app",
        {
          email : email,
          sent_at : sent_at,
        },
        {
          headers: {
            "Accept": "application/json",
            'Content-Type': 'multipart/form-data'
            }
        },
      );
      if (res.status == 200) {
        setShow(true);
        setCountDown(200);
        setLoginFail(false);
        setError(false);
        setLoadOtp(false);
      } else if (res.status == 202) {
        const resData = await axios.post(
          BASE_URL + '/check-cooldown',
          {
            email,
            sent_at,
          },
          {
            headers: {'Content-Type': 'application/json'},
          },
        );
        if (resData.data < 200 && resData.status == 200) {
          setShow(true);
          setCountDown(200 - resData.data);
          setLoginFail(false);
          setError(false);
          setLoadOtp(false);
        } else {
          setLoadOtp(false);
        }
      } else {
        loadOtp(false);
      }

      let i = setInterval(() => {
        setCountDown(cd => cd - 1);
        return () => clearInterval(i);
      }, 1000);
    } catch (err) {
      setLoginFail(true);
      setOtp('');
      setLoadOtp(false);
      setError(true);
      console.error('err', err);
    }
  };

  if (countdown == 0) {
    setOtp('');
    setCountDown(200);
    setShow(false);
    setError(false);
    setLoadOtp(false);
  }

  const handleLogin = () => {
    login(email, otp);
  };

  return (
    <GestureHandlerRootView style={{flex: 1, height: '100%'}}>
      <ImageBackground
        source={require('../../assets/images/splash_2.jpg')}
        resizeMode="cover"
        blurRadius={0.9}
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        {showLi == false && (
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
              style={{
                width: '90%',
                height: dimensions.height * 0.78,
                backgroundColor: 'white',
                alignSelf: 'center',
                marginTop: 20,
                borderRadius: 12,
              }}>
              <View style={{paddingHorizontal: 25}}>
                <View style={{alignItems: 'center', marginTop: 30}}>
                  <Image
                    style={{width: 149, height: 100}}
                    source={require('../../assets/images/give-graden.png')}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: '700',
                    color: '#004AAD',
                    paddingTop: 30,
                    textAlign: 'center',
                  }}>
                  {t("join")}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#10C45C',
                    textAlign: 'center',
                    paddingBottom: 30,
                    paddingTop: 4,
                  }}>
                  {t("sub_join")}
                </Text>
                <InputField
                  label={'Email'}
                  color="grey"
                  emailValidator={emailValidator}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={text => setEmail(text)}
                  fieldButtonFunction={() => {}}
                />
                <Text
                  style={{
                    color: 'red',
                    paddingTop: 2,
                  }}>
                  {emailError}
                </Text>
                {loginFail == true && (
                  <Text
                    style={{
                      color: 'red',
                    }}>
                    Tài khoản đăng nhập không chính xác
                  </Text>
                )}
                {show && (
                  <>
                    <InputField
                      inputType={'OTP'}
                      label={t('sent_otp')}
                      color="grey"
                      value={otp}
                      onChangeText={text => setOtp(text)}
                      onChangeOtp={onChangeOtp}
                      fieldButtonFunction={() => {}}
                      keyboardType="phone-pad"
                    />
                    <Text
                      style={{
                        color: 'green',
                        paddingVertical: 4,
                      }}>
                      {t("otp_expire")} {countdown}s
                    </Text>
                    {Error == true && (
                      <Text
                        style={{
                          color: 'red',
                          textAlign: 'center',
                        }}>
                        {err_message}
                      </Text>
                    )}
                  </>
                )}
                <Spacer height={20} />

                {show ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#10C45C',
                      padding: 20,
                      width: '60%',
                      borderRadius: 30,
                      alignSelf: 'center',
                    }}
                    disabled={isSelected ? false : true}
                    onPress={handleLogin}>
                    {isLoading ? (
                      <ActivityIndicator size={'small'} color={'white'} />
                    ) : (
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 14,
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}>
                        {t("login")}
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#10C45C',
                      padding: 20,
                      width: '60%',
                      borderRadius: 30,
                      alignSelf: 'center',
                    }}
                    onPress={handleOtp}>
                    {loadOtp == true && Error == true ? (
                      <ActivityIndicator size={'small'} color={'white'} />
                    ) : (
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 14,
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}>
                         {t('send_otp')}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

                <Spacer height={30} />
                {show && (
                  <View style={styles.checkboxContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <CheckBox
                        isChecked={isSelected}
                        onClick={() => setSelection(!isSelected)}
                        style={styles.checkbox}
                      />
                      <TouchableOpacity onPress={onPress}>
                        <Text style={styles.label}>
                          {t('term')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}

        {/* {showLi && <ViewLicense showLicense={showLicense} />} */}
      </ImageBackground>

      <BottomSheetLicense ref={ref}>
        <DataLicense />
      </BottomSheetLicense>
      {/* </View> */}
    </GestureHandlerRootView>
  );
};

export default LoginScreen;

const DataLicense = () => {
  return (
    <View style={{flex: 1, paddingHorizontal: 10}}>
      <ScrollView style={{flex: 1}}>
        <View style={{padding: 10}}>
          <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 700}}>
            END USER LICENSE AGREEMENT
          </Text>
          <Text style={{textAlign: 'center', paddingTop: 4}}>
            Last updated March 23, 2023
          </Text>
        </View>
        <View>
          <Text>
            GIVE Garden is licensed to You (End-User) by GIVE Garden inc,
            located at __________, __________, __________ __________, __________
            ("Licensor"), for use only under the terms of this License
            Agreement. By downloading the Licensed Application from Apple's
            software distribution platform ("App Store") and Google's software
            distribution platform ("Play Store"), and any update thereto (as
            permitted by this License Agreement), You indicate that You agree to
            be bound by all of the terms and conditions of this License
            Agreement, and that You accept this License Agreement. App Store and
            Play Store are referred to in this License Agreement as "Services."
            The parties of this License Agreement acknowledge that the Services
            are not a Party to this License Agreement and are not bound by any
            provisions or obligations with regard to the Licensed Application,
            such as warranty, liability, maintenance and support thereof. Give
            Garden inc, not the Services, is solely responsible for the Licensed
            Application and the content thereof. This License Agreement may not
            provide for usage rules for the Licensed Application that are in
            conflict with the latest Apple Media Services Terms and Conditions
            and Google Play Terms of Service ("Usage Rules"). GIVE Garden inc
            acknowledges that it had the opportunity to review the Usage Rules
            and this License Agreement is not conflicting with them. GIVE Garden
            when purchased or downloaded through the Services, is licensed to
            You for use only under the terms of this License Agreement. The
            Licensor reserves all rights not expressly granted to You. Give
            Garden is to be used on devices that operate with Apple's operating
            systems ("iOS" and "Mac OS") or Google's operating system
            ("Android").
          </Text>
        </View>

        <View style={{paddingTop: 20, paddingBottom: 70}}>
          <View style={{paddingVertical: 4}}>
            <Text style={{fontSize: 18, fontWeight: 600, paddingVertical: 8}}>
              1. THE APPLICATION
            </Text>
            <Text>
              GIVE Garden ("Licensed Application") is a piece of software
              created to Fitness App for GIVE Garden Community — and customized
              for iOS and Android mobile devices ("Devices"). It is used to
              Check in Progress, Ask Coach. The Licensed Application is not
              tailored to comply with industry-specific regulations (Health
              Insurance Portability and Accountability Act (HIPAA), Federal
              Information Security Management Act (FISMA), etc.), so if your
              interactions would be subjected to such laws, you may not use this
              Licensed Application. You may not use the Licensed Application in
              a way that would violate the Gramm-Leach-Bliley Act (GLBA).
            </Text>
          </View>
          <View style={{paddingVertical: 4}}>
            <Text style={{fontSize: 18, fontWeight: 600, paddingVertical: 8}}>
              2. SCOPE OF LICENSE
            </Text>
            <Text>
              2.1 You are given a non-transferable, non-exclusive,
              non-sublicensable license to install and use the Licensed
              Application on any Devices that You (End-User) own or control and
              as permitted by the Usage Rules, with the exception that such
              Licensed Application may be accessed and used by other accounts
              associated with You (End-User, The Purchaser) via Family Sharing
              or volume purchasing. 2.2 This license will also govern any
              updates of the Licensed Application provided by Licensor that
              replace, repair, and/or supplement the first Licensed Application,
              unless a separate license is provided for such update, in which
              case the terms of that new license will govern. 2.3 You may not
              share or make the Licensed Application available to third parties
              (unless to the degree allowed by the Usage Rules, and with Give
              Garden inc's prior written consent), sell, rent, lend, lease or
              otherwise redistribute the Licensed Application. 2.4 You may not
              reverse engineer, translate, disassemble, integrate, decompile,
              remove, modify, combine, create derivative works or updates of,
              adapt, or attempt to derive the source code of the Licensed
              Application, or any part thereof (except with GIVE Garden inc's
              prior written consent).
            </Text>
          </View>
          <View style={{paddingVertical: 4}}>
            <Text style={{fontSize: 18, fontWeight: 600, paddingVertical: 8}}>
              3. TECHNICAL REQUIREMENTS
            </Text>
            <Text>
              3.1 Licensor attempts to keep the Licensed Application updated so
              that it complies with modified/new versions of the firmware and
              new hardware. You are not granted rights to claim such an update.
            </Text>
          </View>
          <View style={{paddingVertical: 4}}>
            <Text style={{fontSize: 18, fontWeight: 600, paddingVertical: 8}}>
              4. MAINTENANCE AND SUPPORT
            </Text>
            <Text>
              4.1 The Licensor is solely responsible for providing any
              maintenance and support services for this Licensed Application.
              You can reach the Licensor at the email address listed in the App
              Store or Play Store Overview for this Licensed Application. 4.2
              GIVE Garden inc and the End-User acknowledge that the Services
              have no obligation whatsoever to furnish any maintenance and
              support services with respect to the Licensed Application.
            </Text>
          </View>
          <View style={{paddingVertical: 4}}>
            <Text style={{fontSize: 18, fontWeight: 600, paddingVertical: 8}}>
              5. USE OF DATA
            </Text>
            <Text>
              You acknowledge that Licensor will be able to access and adjust
              Your downloaded Licensed Application content and Your personal
              information, and that Licensor's use of such material and
              information is subject to Your legal agreements with Licensor and
              Licensor's privacy policy:
              https://www.privacypolicies.com/live/7a8e27e0-c69c-4fb8-9ca9-e143005029c4.
              You acknowledge that the Licensor may periodically collect and use
              technical data and related information about your device, system,
              and application software, and peripherals, offer product support,
              facilitate the software updates, and for purposes of providing
              other services to you (if any) related to the Licensed
              Application. Licensor may also use this information to improve its
              products or to provide services or technologies to you, as long as
              it is in a form that does not personally identify you.
            </Text>
          </View>
          <View style={{paddingVertical: 4}}>
            <Text style={{fontSize: 18, fontWeight: 600, paddingVertical: 8}}>
              6. USER-GENERATED CONTRIBUTIONS
            </Text>
            <Text>
              The Licensed Application may invite you to chat, contribute to, or
              participate in blogs, message boards, online forums, and other
              functionality, and may provide you with the opportunity to create,
              submit, post, display, transmit, perform, publish, distribute, or
              broadcast content and materials to us or in the Licensed
              Application, including but not limited to text, writings, video,
              audio, photographs, graphics, comments, suggestions, or personal
              information or other material (collectively, "Contributions").
              Contributions may be viewable by other users of the Licensed
              Application and through third-party websites or applications. As
              such, any Contributions you transmit may be treated as
              non-confidential and non-proprietary. When you create or make
              available any Contributions, you thereby represent and warrant
              that: 1. The creation, distribution, transmission, public display,
              or performance, and the accessing, downloading, or copying of your
              Contributions do not and will not infringe the proprietary rights,
              including but not limited to the copyright, patent, trademark,
              trade secret, or moral rights of any third party. 2. You are the
              creator and owner of or have the necessary licenses, rights,
              consents, releases, and permissions to use and to authorize us,
              the Licensed Application, and other users of the Licensed
              Application to use your Contributions in any manner contemplated
              by the Licensed Application and this License Agreement. 3. You
              have the written consent, release, and/or permission of each and
              every identifiable individual person in your Contributions to use
              the name or likeness or each and every such identifiable
              individual person to enable inclusion and use of your
              Contributions in any manner contemplated by the Licensed
              Application and this License Agreement. 4. Your Contributions are
              not false, inaccurate, or misleading. 5. Your Contributions are
              not unsolicited or unauthorized advertising, promotional
              materials, pyramid schemes, chain letters, spam, mass mailings, or
              other forms of solicitation. 6. Your Contributions are not
              obscene, lewd, lascivious, filthy, violent, harassing, libelous,
              slanderous, or otherwise objectionable (as determined by us). 7.
              Your Contributions do not ridicule, mock, disparage, intimidate,
              or abuse anyone. 8. Your Contributions are not used to harass or
              threaten (in the legal sense of those terms) any other person and
              to promote violence against a specific person or class of people.
              9. Your Contributions do not violate any applicable law,
              regulation, or rule. 10. Your Contributions do not violate the
              privacy or publicity rights of any third party. 11. Your
              Contributions do not violate any applicable law concerning child
              pornography, or otherwise intended to protect the health or
              well-being of minors. 12. Your Contributions do not include any
              offensive comments that are connected to race, national origin,
              gender, sexual preference, or physical handicap. 13. Your
              Contributions do not otherwise violate, or link to material that
              violates, any provision of this License Agreement, or any
              applicable law or regulation. Any use of the Licensed Application
              in violation of the foregoing violates this License Agreement and
              may result in, among other things, termination or suspension of
              your rights to use the Licensed Application.
            </Text>
          </View>
          <View style={{paddingVertical: 4}}>
            <Text style={{fontSize: 18, fontWeight: 600, paddingVertical: 8}}>
              7. CONTRIBUTION LICENSE
            </Text>
            <Text>
              By posting your Contributions to any part of the Licensed
              Application or making Contributions accessible to the Licensed
              Application by linking your account from the Licensed Application
              to any of your social networking accounts, you automatically
              grant, and you represent and warrant that you have the right to
              grant, to us an unrestricted, unlimited, irrevocable, perpetual,
              non-exclusive, transferable, royalty-free, fully-paid, worldwide
              right, and license to host, use copy, reproduce, disclose, sell,
              resell, publish, broad cast, retitle, archive, store, cache,
              publicly display, reformat, translate, transmit, excerpt (in whole
              or in part), and distribute such Contributions (including, without
              limitation, your image and voice) for any purpose, commercial
              advertising, or otherwise, and to prepare derivative works of, or
              incorporate in other works, such as Contributions, and grant and
              authorize sublicenses of the foregoing. The use and distribution
              may occur in any media formats and through any media channels.
              This license will apply to any form, media, or technology now
              known or hereafter developed, and includes our use of your name,
              company name, and franchise name, as applicable, and any of the
              trademarks, service marks, trade names, logos, and personal and
              commercial images you provide. You waive all moral rights in your
              Contributions, and you warrant that moral rights have not
              otherwise been asserted in your Contributions. We do not assert
              any ownership over your Contributions. You retain full ownership
              of all of your Contributions and any intellectual property rights
              or other proprietary rights associated with your Contributions. We
              are not liable for any statements or representations in your
              Contributions provided by you in any area in the Licensed
              Application. You are solely responsible for your Contributions to
              the Licensed Application and you expressly agree to exonerate us
              from any and all responsibility and to refrain from any legal
              action against us regarding your Contributions. We have the right,
              in our sole and absolute discretion, (1) to edit, redact, or
              otherwise change any Contributions; (2) to recategorize any
              Contributions to place them in more appropriate locations in the
              Licensed Application; and (3) to prescreen or delete any
              Contributions at any time and for any reason, without notice. We
              have no obligation to monitor your Contributions.
            </Text>
          </View>
          <View style={{paddingVertical: 4}}>
            <Text style={{fontSize: 18, fontWeight: 600, paddingVertical: 8}}>
              8. LIABILITY
            </Text>
            <Text>
              8.1 Licensor's responsibility in the case of violation of
              obligations and tort shall be limited to intent and gross
              negligence. Only in case of a breach of essential contractual
              duties (cardinal obligations), Licensor shall also be liable in
              case of slight negligence. In any case, liability shall be limited
              to the foreseeable, contractually typical damages. The limitation
              mentioned above does not apply to injuries to life, limb, or
              health.
            </Text>
          </View>
          <View style={{paddingVertical: 4}}>
            <Text style={{fontSize: 18, fontWeight: 600, paddingVertical: 8}}>
              9. WARRANTY
            </Text>
            <Text>
              9.1 Licensor warrants that the Licensed Application is free of
              spyware, trojan horses, viruses, or any other malware at the time
              of Your download. Licensor warrants that the Licensed Application
              works as described in the user documentation. 9.2 No warranty is
              provided for the Licensed Application that is not executable on
              the device, that has been unauthorizedly modified, handled
              inappropriately or culpably, combined or installed with
              inappropriate hardware or software, used with inappropriate
              accessories, regardless if by Yourself or by third parties, or if
              there are any other reasons outside of GIVE Garden inc's sphere of
              influence that affect the executability of the Licensed
              Application. 9.3 You are required to inspect the Licensed
              Application immediately after installing it and notify GIVE Garden
              inc about issues discovered without delay by email provided in
              Contact Information. The defect report will be taken into
              consideration and further investigated if it has been emailed
              within a period of one (1) days after discovery. 9.4 If we confirm
              that the Licensed Application is defective, GIVE Garden inc
              reserves a choice to remedy the situation either by means of
              solving the defect or substitute delivery. 9.5 In the event of any
              failure of the Licensed Application to conform to any applicable
              warranty, You may notify the Services Store Operator, and Your
              Licensed Application purchase price will be refunded to You. To
              the maximum extent permitted by applicable law, the Services Store
              Operator will have no other warranty obligation whatsoever with
              respect to the Licensed Application, and any other losses, claims,
              damages, liabilities, expenses, and costs attributable to any
              negligence to adhere to any warranty. 9.6 If the user is an
              entrepreneur, any claim based on faults expires after a statutory
              period of limitation amounting to twelve (12) months after the
              Licensed Application was made available to the user. The statutory
              periods of limitation given by law apply for users who are
              consumers.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    color: 'gray',
    margin: 4,
    fontWeight: 700,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
